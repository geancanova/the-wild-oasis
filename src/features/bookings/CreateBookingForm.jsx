import {
  formatISO,
  startOfToday,
  startOfDay,
  differenceInDays,
  isPast,
  isToday,
  isFuture,
} from "date-fns";
import { formatAddDays } from "../../utils/helpers";
import { useBookedCabins } from "./useBookedCabins";
import { useCabins } from "../cabins/useCabins";
import { useCreateBooking } from "./useCreateBooking";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGuests } from "./useGuests";
import { useSettings } from "../../context/SetingsContext";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";

function CreateBookingForm({ onCloseModal }) {
  const { isLoading: isLoadingCabins, cabins } = useCabins();
  const { isLoading: isLoadingGuests, guests } = useGuests();
  const { breakfastPrice, minBookingLength, maxBookingLength } = useSettings();

  const { isCreating, createBooking } = useCreateBooking();
  const isWorking = isCreating;

  const initMinEndDate = formatAddDays(startOfToday(), minBookingLength);
  const initMaxEndDate = formatAddDays(startOfToday(), maxBookingLength);

  const [startDate, setStartDate] = useState(
    formatISO(startOfToday(), {
      representation: "date",
    })
  );
  const [endDate, setEndDate] = useState(initMinEndDate);
  const [minEndDate, setMinEndDate] = useState(initMinEndDate);
  const [maxEndDate, setMaxEndDate] = useState(initMaxEndDate);

  const bookedCabins = useBookedCabins(startDate, endDate);

  const [numOfGuests, setNumOfGuests] = useState(1);
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const isCheckedout = startOfDay(endDate) < startOfToday();

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      startDate,
    },
  });
  const { errors } = formState;

  function getSelectedCabin(cabinId) {
    return cabins?.find((cabin) => cabin.id === Number(cabinId));
  }

  // Fix date-fns returns one day previous value
  function formatDate(date) {
    return date.replace(/-/g, "/");
  }

  function handleStartDate(e) {
    const dateString = e.target.value;
    const date = formatDate(dateString);
    setStartDate(dateString);

    const updatedMinEndDate = formatAddDays(date, minBookingLength);
    setMinEndDate(updatedMinEndDate);
    setEndDate(updatedMinEndDate);

    const updatedMaxEndDate = formatAddDays(date, maxBookingLength);
    setMaxEndDate(updatedMaxEndDate);
  }

  function onSubmit(data) {
    // Number of nights
    const numNights = differenceInDays(
      new Date(data.endDate),
      new Date(data.startDate)
    );

    // Selected cabin price
    const selectedCabin = getSelectedCabin(data.cabinId);
    const { regularPrice, discount } = selectedCabin;
    const selectedCabinPrice = (regularPrice - discount) * numNights;

    // Extras price
    const extrasPrice = hasBreakfast
      ? breakfastPrice * data.numGuests * numNights
      : 0;

    // Total price
    const totalPrice = selectedCabinPrice + extrasPrice;

    // Set booking status
    const formatStartDate = formatDate(data.startDate);
    const formatEndDate = formatDate(data.endDate);
    let status;
    if (isPast(formatEndDate) && !isToday(formatEndDate))
      status = "checked-out";
    if (isFuture(formatStartDate) || isToday(formatStartDate))
      status = "unconfirmed";
    if (
      (isFuture(formatEndDate) || isToday(formatEndDate)) &&
      isPast(formatStartDate) &&
      !isToday(formatStartDate)
    )
      status = "checked-in";

    const finalData = {
      ...data,
      created_at: startOfDay(formatStartDate),
      numNights,
      cabinPrice: selectedCabinPrice,
      extrasPrice,
      totalPrice,
      hasBreakfast,
      isPaid: isCheckedout || isPaid,
      status,
    };

    console.log(finalData);
    createBooking(finalData, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      },
    });
  }

  function onError(errors) {
    // Just to made know that this function exists. Can be used to send error reports to a service, e.g.
    console.log(errors);
  }

  if (isLoadingCabins || isLoadingGuests) return <Spinner />;

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Guest name" error={errors?.guestId?.message}>
        <Select
          id="guestId"
          $type="white"
          emptyValue={true}
          options={guests.map((guest) => ({
            value: guest.id,
            label: guest.fullName,
          }))}
          {...register("guestId", {
            disabled: isWorking,
            valueAsNumber: true,
            required: "Select a guest",
          })}
        />
      </FormRow>

      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          {...register("startDate", {
            disabled: isWorking,
            onChange: handleStartDate,
          })}
        />
      </FormRow>

      <FormRow
        label="End date"
        tip={`min: ${minBookingLength} / max: ${maxBookingLength} nights`}
        error={errors?.endDate?.message}
      >
        <Input
          type="date"
          min={minEndDate}
          max={maxEndDate}
          id="endDate"
          value={endDate}
          {...register("endDate", {
            disabled: isWorking,
            onChange: (e) => {
              setEndDate(e.target.value);
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Cabin"
        tip="Cabins available for selected dates"
        error={errors?.cabinId?.message}
      >
        <Select
          id="cabinId"
          $type="white"
          emptyValue={true}
          options={cabins.map((cabin) => ({
            value: cabin.id,
            label: `${cabin.name} (max: ${cabin.maxCapacity} people)`,
            disabled: bookedCabins.includes(cabin.id),
          }))}
          {...register("cabinId", {
            disabled: isWorking,
            required: "Select a cabin",
            valueAsNumber: true,
            onChange: (e) => {
              const curCabin = getSelectedCabin(e.target.value);
              setNumOfGuests(curCabin ? curCabin.maxCapacity : 1);
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Number of guests"
        tip="Including the main guest"
        error={errors?.numGuests?.message}
      >
        <Select
          id="numGuests"
          $type="white"
          disabled={isWorking || numOfGuests === 1}
          options={Array.from(Array(numOfGuests), (_e, i) => {
            return { value: i + 1, label: `${i + 1}` };
          })}
          {...register("numGuests", {
            disabled: isWorking || numOfGuests === 1,
            valueAsNumber: true,
          })}
        />
      </FormRow>

      <FormRow label="Include breakfast?" error={errors?.hasBreakfast?.message}>
        <Checkbox
          id="hasBreakfast"
          disabled={isWorking}
          onChange={() => setHasBreakfast((val) => !val)}
        >
          Yes
        </Checkbox>
      </FormRow>

      <FormRow label="It's paid?" error={errors?.isPaid?.message}>
        <Checkbox
          id="isPaid"
          checked={isCheckedout || isPaid}
          disabled={isWorking || isCheckedout}
          onChange={() => {
            setIsPaid((val) => !val);
          }}
        >
          Yes
        </Checkbox>
      </FormRow>

      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          id="observations"
          defaultValue=""
          {...register("observations", {
            disabled: isWorking,
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          $variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>Create new booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;

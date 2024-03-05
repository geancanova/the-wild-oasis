import { useEffect, useState } from "react";
import { getBookedCabinsFromDates } from "../../services/apiBookings";

export function useBookedCabins(startDate, endDate) {
  const [bookedCabins, setbookedCabins] = useState([]);

  useEffect(
    function () {
      async function fetchBookedCabins() {
        try {
          const data = await getBookedCabinsFromDates(startDate, endDate);
          const cabinId = data.map(({ cabinId }) => cabinId);
          setbookedCabins(cabinId);
        } catch (error) {
          throw new Error(`Error: ${error.message}`);
        }
      }
      fetchBookedCabins();
    },
    [startDate, endDate]
  );

  return bookedCabins;
}
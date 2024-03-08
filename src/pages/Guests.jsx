import { useGuests } from "../features/guests/useGuests";

import Heading from "../ui/Heading";
import Row from "../ui/Row";
import GuestTable from "../features/guests/GuestTable";
import Spinner from "../ui/Spinner";
import Empty from "../ui/Empty";
import GuestTableOperations from "../features/guests/GuestTableOperations";
import AddGuest from "../features/guests/AddGuest";

function Guests() {
  const { guests, isLoading, count } = useGuests();

  if (isLoading) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All guests</Heading>
        <GuestTableOperations />
      </Row>

      {!guests.length ? (
        <Empty resourceName="guests" />
      ) : (
        <GuestTable guests={guests} count={count} />
      )}
      <AddGuest />
    </>
  );
}

export default Guests;

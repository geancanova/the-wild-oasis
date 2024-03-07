import { useBookings } from "../features/bookings/useBookings";
import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import AddBooking from "../features/bookings/addBooking";
import Empty from "../ui/Empty";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/Spinner";
function Bookings() {
  const { bookings, isLoading, count } = useBookings();

  if (isLoading) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>
        {bookings.length ? <BookingTableOperations /> : null}
      </Row>

      {!bookings.length ? (
        <Empty resourceName="bookings" />
      ) : (
        <BookingTable bookings={bookings} count={count} />
      )}
      <AddBooking />
    </>
  );
}

export default Bookings;

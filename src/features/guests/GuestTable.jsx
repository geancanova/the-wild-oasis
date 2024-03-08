import GuestRow from "./GuestRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Pagination from "../../ui/Pagination";

function GuestTable({ guests, count }) {
  return (
    <Menus>
      <Table columns="1fr .8fr 1.2fr 3.2rem">
        <Table.Header>
          <div>Guest</div>
          <div>National ID</div>
          <div>Nationality</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={guests}
          render={(guest) => <GuestRow key={guest.id} guest={guest} />}
        />

        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default GuestTable;

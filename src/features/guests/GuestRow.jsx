import styled from "styled-components";

import { useDeleteGuest } from "./useDeleteGuest";

import { HiPencil, HiTrash } from "react-icons/hi2";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import CreateGuestForm from "./CreateGuestForm";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Nationality = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

function GuestRow({ guest }) {
  const { isDeleting, deleteGuest } = useDeleteGuest();

  const {
    id: guestId,
    fullName: guestName,
    email,
    nationality,
    countryFlag,
    nationalID,
  } = guest;

  return (
    <Table.Row>
      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <div>{nationalID}</div>

      <Nationality>
        <img width={20} src={countryFlag} alt="Country flag" />
        <span>{nationality}</span>
      </Nationality>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={guestId} />
          <Menus.List id={guestId}>
            <Modal.Open opens="edit">
              <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
            </Modal.Open>

            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>
          </Menus.List>

          <Modal.Window name="edit">
            <CreateGuestForm guestToEdit={guest} />
          </Modal.Window>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="guests"
              disabled={isDeleting}
              onConfirm={() => deleteGuest(guestId)}
            />
          </Modal.Window>
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

export default GuestRow;

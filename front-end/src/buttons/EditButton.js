import React from "react";
import { Link } from "react-router-dom";

function EditButton({ reservation }) {
  return (
    <td>
      <Link
        to={`/reservations/${reservation.reservation_id}/edit`}
        className=""
      >
        Edit
      </Link>
    </td>
  );
}

export default EditButton;
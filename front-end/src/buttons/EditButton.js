import React from "react";
import { Link } from "react-router-dom";

function EditButton({ reservation }) {
  return (
    <td>
      <Link
        className="btn btn-outline-secondary btn-sm"
        to={`/reservations/${reservation.reservation_id}/edit`}
      >
        Edit
      </Link>
    </td>
  );
}

export default EditButton;

import React from "react";
import { Link } from "react-router-dom";

function EditButton({reservation}) {
  return (
    <Link
      to={`/reservations/${reservation.reservation_id}/edit`}
      className="btn btn-outline-secondary"
    >
      Edit
    </Link>
  );
}

export default EditButton;
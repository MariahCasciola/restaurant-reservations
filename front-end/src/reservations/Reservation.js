import React from "react";
import { Link } from "react-router-dom";

function Reservation({ reservation }) {
  const {
    first_name = "",
    last_name = "",
    mobile_number = "",
    reservation_date = "",
    reservation_time = "",
    people = "",
  } = reservation;

  return (
    <div>
      <div>
        Name: {first_name} {last_name}
      </div>
      <div> Phone Number: {mobile_number} </div>
      <div> Date: {reservation_date} </div>
      <div> Time: {reservation_time} </div>
      <div> Number of guests: {people} </div>
      <div data-reservation-id-status={reservation.reservation_id}>
        Status: {reservation.status}
      </div>
      {reservation.status === "booked" ? (
        <Link to={`/reservations/${reservation.reservation_id}/seat`}>
          Seat
        </Link>
      ) : null}
    </div>
  );
}

export default Reservation;

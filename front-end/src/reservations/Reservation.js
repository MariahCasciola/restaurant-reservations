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
      <Link to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link>
    </div>
  );
}

export default Reservation;

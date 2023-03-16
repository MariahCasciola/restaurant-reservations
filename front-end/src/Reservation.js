import React from "react";

function Reservation({ reservation, loadList }) {
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
    </div>
  );
}

export default Reservation;

import React from "react";
import { Link } from "react-router-dom";
import EditButton from "../buttons/EditButton";
import { cancelReservation } from "../utils/api";

function Reservation({ reservation, loadDashboard }) {
  const {
    first_name = "",
    last_name = "",
    mobile_number = "",
    reservation_date = "",
    reservation_time = "",
    people = "",
  } = reservation;

  const cancelled = (event) => {
    const reservation_id = event.target.getAttribute(
      "data-reservation-id-cancel"
    );

    const confirmed = window.confirm(
      "Do you want to cancel this reservation?\n\nThis cannot be undone."
    );
    if (confirmed) {
      // sets reservation status to cancelled by
      // PUT request to /reservations/:reservation_id/status with a body of {data: { status: "cancelled" } }
      // results on the page are refreshed
      const controller = new AbortController();
      cancelReservation(reservation_id, controller.signal).then(loadDashboard);
    }
  };

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
        <div>
          <Link
            to={`/reservations/${reservation.reservation_id}/seat`}
            className="btn btn-outline-primary"
          >
            Seat
          </Link>
        </div>
      ) : null}
      <EditButton reservation={reservation} />
      <button
        data-reservation-id-cancel={reservation.reservation_id}
        className="btn btn-outline-danger"
        onClick={cancelled}
      >
        Cancel
      </button>
    </div>
  );
}

export default Reservation;

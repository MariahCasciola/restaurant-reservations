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

  const cancelled = async (event) => {
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
      try {
        await cancelReservation(reservation_id, controller.signal);
        await loadDashboard();
      } catch (error) {
        console.log(error);
      }
      return controller.abort();
    }
  };

  return (
    <tbody>
      <tr>
        <td>{first_name}</td>
        <td> {last_name}</td>
        <td>{mobile_number}</td>
        <td>{reservation_date}</td>
        <td>{reservation_time}</td>
        <td>{people} </td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        {reservation.status === "booked" ? (
          <td>
            <Link
              className="btn btn-outline-info btn-sm"
              to={`/reservations/${reservation.reservation_id}/seat`}
            >
              Seat
            </Link>
          </td>
        ) : (
          <td className="">
            <button className="btn btn-outline-danger btn-sm" disabled>
              Seated
            </button>
          </td>
        )}
        <EditButton reservation={reservation} />
        <td>
          <button
            className="btn btn-outline-danger btn-sm"
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={cancelled}
          >
            Cancel
          </button>
        </td>
      </tr>
    </tbody>
  );
}

export default Reservation;

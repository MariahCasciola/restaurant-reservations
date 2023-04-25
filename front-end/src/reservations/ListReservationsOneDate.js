import React from "react";
import Reservation from "./Reservation";

function ListReservationsOneDate({ reservations, loadDashboard }) {
  return !reservations || !reservations.length ? null : (
    <div className="table-responsive">
      <table className="table">
        <thead className="table-light">
          <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Number of guests</th>
            <th scope="col">Status</th>
            <th scope="col">Seat</th>
            <th scope="col">Edit</th>
            <th scope="col">Cancel</th>
          </tr>
        </thead>
        {reservations.map((reservation, index) => (
          <Reservation
            key={index}
            reservation={reservation}
            loadDashboard={loadDashboard}
          />
        ))}
      </table>
    </div>
  );
}

export default ListReservationsOneDate;

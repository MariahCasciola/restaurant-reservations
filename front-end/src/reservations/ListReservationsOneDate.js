import React from "react";
import Reservation from "./Reservation";
// import { listReservations } from "./utils/api";
// import useQuery from "./utils/useQuery";

function ListReservationsOneDate({ reservations, loadDashboard }) {
  return !reservations || !reservations.length ? null : (
    <div>
      {reservations.map((reservation, index) => (
        <Reservation
          key={index}
          reservation={reservation}
          loadDashboard={loadDashboard}
        />
      ))}
    </div>
  );
}

export default ListReservationsOneDate;

import React from "react";
import Reservation from "./Reservation";
// import { listReservations } from "./utils/api";
// import useQuery from "./utils/useQuery";

function ListReservationsOneDate({reservations}) {


  return (
    <div>
      {reservations.map((reservation, index) => (
        <Reservation
          key={index}
          reservation={reservation}
        />
      ))}
    </div>
  );
}

export default ListReservationsOneDate;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation } from "../utils/api";
import ReservationsForm from "./ReservationsForm";

function EditReservation() {
  // useParams
  const params = useParams();
  const [editFormState, setEditFormState] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });
  const [editError, setEditError] = useState(null);

  //useEffect
  //  api call read, setEditFormState
  useEffect(loadEditPage, [params]);

  //helper function will be first parameter in the useEffect
  function loadEditPage() {
    setEditError(null);
    const controller = new AbortController();
    readReservation(params.reservation_id, controller.signal)
      .then(setEditFormState)
      .catch(setEditError);
    return () => controller.abort();
  }

  return (
    <div>
      <ErrorAlert error={editError} />
      <h1 className="containter text-center fs-3 m-3">Edit Reservation</h1>
      <ReservationsForm initialFormState={editFormState} isCreateType={false} />
    </div>
  );
}

export default EditReservation;

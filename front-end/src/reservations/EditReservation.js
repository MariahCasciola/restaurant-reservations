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
      <div>Edit Reservation</div>
      <ReservationsForm
        initialFormState={editFormState}
        isCreateType={false}
        handleSubmit={() => console.log("Do something fruity")}
      />
    </div>
  );
}

export default EditReservation;

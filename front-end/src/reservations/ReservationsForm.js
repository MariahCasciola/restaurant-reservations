import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservations, updateReservation } from "../utils/api";

function ReservationsForm({ initialFormState, isCreateType = true }) {
  const history = useHistory();
  const params = useParams();
  // useState for state of the reservations form
  const [formData, setFormData] = useState({ ...initialFormState });
  // add a useState for error
  const [error, setError] = useState(null);
  // use state for edit??
  // if condition for edit?

  useEffect(() => {
    setFormData(initialFormState);
  }, [initialFormState]);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    // call a create function from api.js
    // call with {..reservation, people: Number(reservation.people)}
    async function createNewReservation() {
      try {
        await createReservations({
          ...formData,
          people: Number(formData.people),
        });
        // setFormData to
        setFormData({ ...initialFormState });
        history.push(`/dashboard?date=${formData.reservation_date}`);
      } catch (error) {
        setError(error);
      }
    }
    createNewReservation();
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    async function updateOldReservation() {
      const controller = new AbortController();
      try {
        // console.log(formData)
        // params+> reservation, reservation_id. signal
        await updateReservation(
          {
            ...formData,
            people: Number(formData.people),
          },
          params.reservation_id,
          controller.signal
        );
       history.push(`/dashboard?date=${formData.reservation_date}`);
      } catch (error) {
        setError(error);
      }
    }
    updateOldReservation();
  };

  return (
    <div>
      <form onSubmit={isCreateType ? handleCreate : handleEdit}>
        <ErrorAlert error={error} />
        <label htmlFor="first_name">
          First Name:
          <input
            name="first_name"
            type="text"
            onChange={handleChange}
            value={formData.first_name}
          />
        </label>
        <label htmlFor="last_name">
          Last Name:
          <input
            name="last_name"
            type="text"
            onChange={handleChange}
            value={formData.last_name}
          />
        </label>
        <label htmlFor="mobile_number">
          Mobile number:
          <input
            name="mobile_number"
            type="text"
            onChange={handleChange}
            value={formData.mobile_number}
          />
        </label>
        <label htmlFor="reservation_date">
          Date of reservation :
          <input
            name="reservation_date"
            type="date"
            onChange={handleChange}
            value={formData.reservation_date}
          />
        </label>
        <label htmlFor="reservation_time">
          Time of reservation:
          <input
            name="reservation_time"
            type="time"
            onChange={handleChange}
            value={formData.reservation_time}
          />
        </label>
        <label htmlFor="people">
          Number of People:
          <input
            name="people"
            type="number"
            onChange={handleChange}
            value={formData.people}
          />
        </label>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationsForm;

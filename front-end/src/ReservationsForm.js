import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "./layout/ErrorAlert";
import { createReservations } from "./utils/api";

function ReservationsForm() {
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };
  // useState for state of the reservations form
  const [formData, setFormData] = useState({ ...initialFormState });
  // add a useState for error
  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // call a create function from api.js
    // call with {..reservation, people: Number(reservation.people)}
    async function createNewReservation() {
      try {
        const newReservation = await createReservations({
          ...formData,
          people: Number(formData.people),
        });
        setFormData({ ...initialFormState });
        history.push(`/dashboard?date=${newReservation.reservation_date}`);
      } catch (error) {
        setError(error);
      }
    }
    createNewReservation();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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

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
    <div className="container text-center">
        <h1>Create a reservation</h1>
        <form onSubmit={isCreateType ? handleCreate : handleEdit}>
          <ErrorAlert error={error} />
          <div className="mb-3">
            <label className="form-label" htmlFor="first_name">
              First Name:
              <input
                className="form-control"
                name="first_name"
                type="text"
                onChange={handleChange}
                value={formData.first_name}
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="last_name">
              Last Name:
              <input
                className="form-control"
                name="last_name"
                type="text"
                onChange={handleChange}
                value={formData.last_name}
              />
            </label>
        <label htmlFor="mobile_number">
          Mobile number:
          <input
                className="form-control"
                name="mobile_number"
                type="text"
                onChange={handleChange}
                value={formData.mobile_number}
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="reservation_date">
              Date of reservation :
              <input
                className="form-control"
                name="reservation_date"
                type="date"
                onChange={handleChange}
                value={formData.reservation_date}
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="reservation_time">
              Time of reservation:
              <input
                className="form-control"
                name="reservation_time"
                type="time"
                onChange={handleChange}
                value={formData.reservation_time}
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="people">
              Number of People:
              <input
                className="form-control"
                name="people"
                type="number"
                onChange={handleChange}
                value={formData.people}
              />
            </label>
          </div>
          <button type="submit" className="btn btn-outline-info">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </form>
    </div>
  );
}

export default ReservationsForm;

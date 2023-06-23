import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservationsOneDate from "../reservations/ListReservationsOneDate";
import { listReservations } from "../utils/api";

function Search() {
  const initialSearchState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "",
  };

  const [formData, setFormData] = useState({ ...initialSearchState });
  const [searchedReservations, setSearchedReservations] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    async function listFoundReservations() {
      const controller = new AbortController();
      try {
        const param = {
          ...formData,
          mobile_number: formData.mobile_number,
        };
        const reservationsByNumber = await listReservations(
          param,
          controller.signal
        );
        setSearchedReservations(reservationsByNumber);
      } catch (error) {
        setError(error);
        console.log(error);
      }
    }
    listFoundReservations();
  };

  return (
    <div className="container text-center">
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="m-3 fs-1">
            <h1>Find a Reservation</h1>
          </div>
          <div className="col">
            <label className="form-label">
              <input
                className="form-control"
                name="mobile_number"
                type="text"
                onChange={handleChange}
                value={formData.mobile_number}
                placeholder="Enter a customer's phone number"
              />
            </label>
            <button className="btn btn-outline-info ms-2" type="submit">
              Find
            </button>
          </div>
          <div>
            {!searchedReservations || !searchedReservations.length ? (
              "No reservations found"
            ) : (
              <ListReservationsOneDate reservations={searchedReservations} />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Search;

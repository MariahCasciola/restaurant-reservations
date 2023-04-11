import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TablesForm() {
  const history = useHistory();
  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    async function addTable() {
      try {
        await createTable({
          ...formData,
          capacity: Number(formData.capacity),
        });
        setFormData({ ...initialFormState });
        history.push(`/dashboard`);
      } catch (error) {
        setError(error);
      }
    }
    addTable();
  };

  return (
    <div className="container text-center">
      <h1>Create a Table</h1>
      <form onSubmit={handleSubmit}>
        <ErrorAlert error={error} />
        <div className="mb-3">
          <label className="form-label" htmlFor="table_name">
            Table:
            <input
              className="form-control"
              name="table_name"
              type="text"
              onChange={handleChange}
              value={formData.table_name}
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="capacity">
            Capacity:
            <input
              className="form-control"
              name="capacity"
              type="number"
              onChange={handleChange}
              value={formData.capacity}
            />
          </label>
        </div>
        <button className="btn btn-outline-info" type="submit">
          Submit
        </button>
        <button
          className="btn btn-outline-danger"
          type="button"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default TablesForm;

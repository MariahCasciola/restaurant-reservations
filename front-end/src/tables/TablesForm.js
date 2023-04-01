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
    <form onSubmit={handleSubmit}>
      <ErrorAlert error={error} />
      <label htmlFor="table_name">
        Table:
        <input
          name="table_name"
          type="text"
          onChange={handleChange}
          value={formData.table_name}
        />
      </label>
      Capacity:
      <label htmlFor="capacity">
        <input
          name="capacity"
          type="number"
          onChange={handleChange}
          value={formData.capacity}
        />
      </label>
      <button type="submit">Submit</button>
      <button type="button" onClick={() => history.goBack()}>
        Cancel
      </button>
    </form>
  );
}

export default TablesForm;

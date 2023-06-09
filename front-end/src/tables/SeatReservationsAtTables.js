import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, updateTable } from "../utils/api";

function SeatReservationsAtTables() {
  const history = useHistory();
  const params = useParams();
  // for load tables
  const [tables, setTables] = useState([]);
  // for handle submit update table
  const [selectedTableId, setSelectedTableId] = useState("");
  // for error message for when a reservation cannot be seated at an occupied table
  const [tablesError, setTablesError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    try {
      async function loadTables() {
        const tableArray = await listTables(controller.signal);
        // console.log(tables);
        setTables(tableArray);
        setSelectedTableId(tableArray[0].table_id);
      }
      loadTables();
    } catch (error) {
      throw console.log(error);
    }
    return () => controller.abort();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const controller = new AbortController();
    // get table.table_id from tables
    async function seatTable() {
      try {
        await updateTable(
          params.reservation_id,
          selectedTableId,
          controller.signal
        );
        history.push(`/dashboard`);
        // parameters for reservation_id, table_id, signal
        // params = reservation_id
      } catch (error) {
        setTablesError(error);
      }
    }
    await seatTable();
    return () => controller.abort();
  };

  const handleChangeSelectState = ({ target }) => {
    console.log(target.value);
    setSelectedTableId(target.value);
  };

  // map each table into a table option
  return (
    <div className="container text-center">
      <ErrorAlert error={tablesError} />
      <h1 className="m-3 fs-1">Choose a Table</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            <select
              id="table_id"
              name="table_id"
              value={selectedTableId}
              onChange={handleChangeSelectState}
            >
              {tables.map((table, index) => {
                return (
                  <option value={table.table_id} key={index}>
                    {table.table_name} - {table.capacity}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
        <button className="btn btn-outline-info" type="submit">
          Submit
        </button>
        <button
          className="btn btn-outline-danger m-2"
          type="button"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SeatReservationsAtTables;

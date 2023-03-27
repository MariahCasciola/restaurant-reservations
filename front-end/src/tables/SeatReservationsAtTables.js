import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, updateTable } from "../utils/api";

function SeatReservationsAtTables() {
  // this is rendered in Routes, should be rendered where tables can be passed down as a prop

  // pass table in order to get
  const history = useHistory();
  const params = useParams();
  // for load tables
  const [tables, setTables] = useState([]);
  // for handle submit update table
  const [selectedTableId, setSelectedTableId] = useState("");

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
    // console.log("event.target", event.target);
    const controller = new AbortController();
    // get table.table_id from tables
    async function seatTable() {
      try {
        await updateTable(
          params.reservation_id,
          selectedTableId,
          controller.signal
        );
        // parameters for reservation_id, table_id, signal
        // params = reservation_id
      } catch (error) {
        console.log(error);
      }
    }
    seatTable();
    history.push(`/dashboard`);
    return () => controller.abort();
  };

  const handleChangeSelectState = ({ target }) => {
    console.log(target.value);
    setSelectedTableId(target.value);
    // console.log(selectState);
  };

  // map each table into a table option
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          choose table
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
        <button type="submit">Submit</button>
        <button type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SeatReservationsAtTables;

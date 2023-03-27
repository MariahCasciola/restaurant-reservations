import React from "react";
import { deleteTable } from "../utils/api";

function Table({ table, loadDashboard }) {
  const { table_name = "", capacity = "" } = table;

  const handleFinishTable = () => {
    const confirmed = window.confirm(
      "Is this table ready to seat new guests?\n\n This cannot be undone."
    );
    if (confirmed) {
      const controller = new AbortController();
      // send a DELETE request to /tables/:table_id/seat
      try {
        deleteTable(table.table_id, controller.signal)
          .then((data) => {
            return data;
          })
          .then(loadDashboard);
      } catch (error) {
        // console.log("error", error);
      }
    }
  };

  return (
    <div>
      <div>Table: {table_name}</div>
      <div>Capacity: {capacity}</div>
      {!table.reservation_id ? (
        <div data-table-id-status={table.table_id}>FREE</div>
      ) : (
        <div>
          <div data-table-id-status={table.table_id}>OCCUPIED</div>
          <button
            data-table-id-finish={table.table_id}
            onClick={handleFinishTable}
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
}

export default Table;
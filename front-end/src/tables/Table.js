import React, { useState } from "react";
import { deleteTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Table({ table, loadDashboard }) {
  const { table_name = "", capacity = "" } = table;
  const [error, setError] = useState(null);

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
        setError(error);
      }
    }
  };

  return (
    <tbody>
      <tr>
        <ErrorAlert error={error} />
        <td>{table_name}</td>
        <td>{capacity}</td>
        <td>
          {!table.reservation_id ? (
            <div data-table-id-status={table.table_id}>FREE</div>
          ) : (
            <div>
              <div data-table-id-status={table.table_id}>OCCUPIED</div>
            </div>
          )}
        </td>
        <td>
          {!table.reservation_id ? null : (
            <button className="btn btn-outline-danger btn-sm"
              data-table-id-finish={table.table_id}
              onClick={handleFinishTable}
            >
              Finish
            </button>
          )}
        </td>
      </tr>
    </tbody>
  );
}

export default Table;

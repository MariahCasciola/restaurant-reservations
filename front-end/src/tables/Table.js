import React from "react";

function Table({ table }) {
  const { table_name = "", capacity = "" } = table;
  return (
    <div>
      <div>Table: {table_name}</div>
      <div>Capacity: {capacity}</div>
      <div data-table-id-status={table.table_id}>
        {table.reservation_id ? "OCCUPIED" : "FREE"}
      </div>
    </div>
  );
}

export default Table;
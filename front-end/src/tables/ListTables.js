import React from "react";
import Table from "./Table";

function ListTables({ tables, loadDashboard }) {
  return (
    <div>
      {tables.map((table, index) => (
        <Table table={table} key={index} loadDashboard={loadDashboard} />
      ))}
    </div>
  );
}

export default ListTables;
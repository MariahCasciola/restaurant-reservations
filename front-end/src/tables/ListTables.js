import React from "react";
import Table from "./Table";

function ListTables({ tables }) {
  return (
    <div>
      {tables.map((table, index) => (
        <Table table={table} key={index} />
      ))}
    </div>
  );
}

export default ListTables;
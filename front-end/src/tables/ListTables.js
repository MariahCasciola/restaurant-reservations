import React from "react";
import Table from "./Table";

function ListTables({ tables, loadDashboard }) {
  return (
    <div className="container text-center">
      <h4>Tables</h4>
      <table className="table table-responsive">
        <thead className="table-light">
          <tr>
            <th scope="col">Table</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        {tables.map((table, index) => (
          <Table table={table} key={index} loadDashboard={loadDashboard} />
        ))}
      </table>
    </div>
  );
}

export default ListTables;

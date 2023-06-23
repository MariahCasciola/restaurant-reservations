import React from "react";
import Table from "./Table";

function ListTables({ tables, loadDashboard }) {
  return (
    <div className="table-responsive">
      <div className="m-3">
        <h2 className="fs-3">Tables</h2>
      </div>
      <table className="table">
        <thead className="table-light">
          <tr>
            <th scope="col">Table</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th scope="col">Finish</th>
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

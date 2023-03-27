const knex = require("../db/connection");

// list all tables sorted by table name
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

// read all tables with
function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

// post
function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdTables) => createdTables[0]);
}

//PUT, needs an table_id and a body
//also used for the "destroy" function in controller and router, which just updates the reservation_id to null to delete a 
function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedTable) => updatedTable[0]);
}

module.exports = {
  list,
  read,
  create,
  update,
};

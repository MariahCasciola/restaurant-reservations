const knex = require("../db/connection");

function list() {
  return knex("reservations");
}

// list all reservations for one date only
// reservations sorted by time
function listAllReservationsForOneDate(date) {
  return knex("reservations")
    .where("reservation_date", date)
    .whereNot("status", "finished")
    .orderBy("reservation_time");
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

//create
function createReservation(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
}

// update
function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((updatedReservation) => updatedReservation[0]);
}

module.exports = {
  list,
  listAllReservationsForOneDate,
  search,
  read,
  createReservation,
  update,
};

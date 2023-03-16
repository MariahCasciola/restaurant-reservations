const knex = require("../db/connection");

function list() {
  return knex("reservations");
}

// list all reservations for one date only
// reservations sorted by time
function listAllReservationsForOneDate(date) {
  return knex("reservations")
    .where("reservation_date", date)
    .orderBy("reservation_time");
}

//create
function createReservation(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
}

module.exports = {
  list,
  listAllReservationsForOneDate,
  createReservation,
};

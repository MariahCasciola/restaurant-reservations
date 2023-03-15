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

module.exports = {
  list,
  listAllReservationsForOneDate,
};

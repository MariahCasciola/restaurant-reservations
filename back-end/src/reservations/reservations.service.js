const knex = require("../db/connection");

// list all reservations for one date only
// reservations sorted by time
function listAllReservationsForOneDate(date) {
    console.log("inside list")
  return knex("reservations")
    .where("reservation_date", date)
    .orderBy("reservation_time")
    // .then((data)=>{console.log("list********", data)})
}

module.exports = {
  listAllReservationsForOneDate,
};

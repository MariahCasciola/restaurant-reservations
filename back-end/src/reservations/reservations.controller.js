/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { date } = req.query;
  //  if the URL is /dashboard?date=2035-12-30 then send a GET to /reservations?date=2035-12-30 to list the reservations for that date)
  // date defaulted to today
  if (date) {
    const data = await service.listAllReservationsForOneDate(date);
    return res.json({ data });
  }
  const data = await service.list();
  return res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
};

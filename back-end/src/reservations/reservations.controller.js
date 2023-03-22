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

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 400, message: "Reservation does not exist." });
}

function read(req, res, next) {
  const data = res.locals.reservation;
  res.json({ data });
}

// validProperties array
const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

// hasValidProperties to create a reservation
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !validProperties.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function dataExists(req, res, next) {
  const data = req.body.data;
  if (data) {
    return next();
  }
  return next({ status: 400, message: "There is no data" });
}

function reservationDateValidator(req, res, next) {
  const date = req.body.data.reservation_date;
  // if reservation is not a date return 400
  let date_regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  if (date_regex.test(date)) {
    return next();
  }
  return next({ status: 400, message: "reservation_date must be a date" });
}

function reservationTimeValidator(req, res, next) {
  const time = req.body.data.reservation_time;
  let time_regex = /^(2[0-3]|[01][0-9]):[0-5][0-9]$/;
  if (time_regex.test(time)) {
    return next();
  }
  next({ status: 400, message: "reservation_time must be a time" });
}

function peopleValidator(req, res, next) {
  const { people } = req.body.data;
  // if people is not a number
  if (!Number.isInteger(people)) {
    return next({ status: 400, message: "people field must contain a number" });
  }
  return next();
}

// checks if certain properties exist
function hasProperties(...properties) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    try {
      properties.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

function closedOnTuesdaysValidator(req, res, next) {
  const date = new Date(
    req.body.data.reservation_date + "T" + req.body.data.reservation_time
  );
  // reservation date.getDay() converts into a number Tuesday = 1
  const dayOfTheWeek = date.getDay();
  // checks if dayOfTheWeek is tuesday, tuesday equals 1, even though the documentation says it equals 2
  if (dayOfTheWeek === 1) {
    return next({ status: 400, message: "Restaurant is closed on Tuesdays." });
  }
  return next();
}

function futureReservationsOnlyValidator(req, res, next) {
  const date = new Date(req.body.data.reservation_date);
  // changes date from post into miliseconds from January 1, 1970
  const dateFromPost = Date.parse(date);
  // todays date from milisecond from January 1, 1970
  const now = Date.now();
  //check if date is before today, or today
  // date from post needs to be
  if (dateFromPost <= now) {
    return next({
      status: 400,
      message: "Reservation must be made in the future.",
    });
  }
  return next();
}

// return 400 when ANY of these are violated

// no reservation time before 10:30 am
function timeConstraintsToCreateReservations(req, res, next) {
  // format date and time
  const time = new Date(
    req.body.data.reservation_date + "T" + req.body.data.reservation_time
  );
  const timeHours = time.getHours();
  const timeMinutes = time.getMinutes();
  // opens
  if (timeHours <= 10 && timeMinutes <= 30) {
    return next({
      status: 400,
      message: "Reservation time must be at 10:30 am, or later.",
    });
  }
  // closes
  if ((timeHours >= 21 && timeMinutes >= 30) || timeHours >= 10) {
    return next({
      status: 400,
      message:
        "Reservation time must be at 9:30 pm, or earlier, the restaurant will be closed at 10:30 pm.",
    });
  }
  return next();
}

// create reservation
async function createReservation(req, res) {
  const data = await service.createReservation(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasValidProperties,
    dataExists,
    hasProperties("first_name"),
    hasProperties("last_name"),
    hasProperties("mobile_number"),
    hasProperties("reservation_date"),
    hasProperties("reservation_time"),
    hasProperties("people"),
    reservationDateValidator,
    reservationTimeValidator,
    peopleValidator,
    closedOnTuesdaysValidator,
    futureReservationsOnlyValidator,
    timeConstraintsToCreateReservations,
    asyncErrorBoundary(createReservation),
  ],
};

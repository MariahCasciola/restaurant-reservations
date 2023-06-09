/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const { first } = require("../db/connection");

async function list(req, res) {
  const { date } = req.query;
  //  if the URL is /dashboard?date=2035-12-30 then send a GET to /reservations?date=2035-12-30 to list the reservations for that date)
  // date defaulted to today
  if (date) {
    const data = await service.listAllReservationsForOneDate(date);
    return res.json({ data });
  }
  const { mobile_number } = req.query;
  if (mobile_number) {
    const data = await service.search(mobile_number);
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
  next({ status: 404, message: `${req.params.reservationId} does not exist.` });
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
  "status",
];

// hasValidProperties to create a reservation
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !validProperties.includes(field)
  );
  // console.log("invalid fields", invalidFields);
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
  if (dayOfTheWeek === 2) {
    return next({ status: 400, message: "Restaurant is closed on Tuesdays." });
  }
  return next();
}

function futureReservationsOnlyValidator(req, res, next) {
  const date = new Date(
    req.body.data.reservation_date + "T" + req.body.data.reservation_time
  );
  const now = new Date();
  const futureError = {
    status: 400,
    message: "Reservation must be in the future.",
  };
  // year
  if (date.getFullYear() < now.getFullYear()) return next(futureError);
  if (date.getFullYear() === now.getFullYear()) {
    // month
    if (date.getMonth() < now.getMonth()) return next(futureError);
    if (date.getMonth() === now.getMonth()) {
      // date
      if (date.getDate() < now.getDate()) return next(futureError);
      if (date.getDate() === now.getDate()) {
        // hour
        if (date.getHours() < now.getHours()) return next(futureError);
        if (date.getHours() === now.getHours()) {
          // minute
          if (date.getMinutes() < now.getMinutes()) return next(futureError);
        }
      }
    }
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
  if (timeHours < 10 || (timeHours === 10 && timeMinutes < 30)) {
    return next({
      status: 400,
      message: "Reservation time must be at 10:30 am, or later.",
    });
  }
  // closes
  if (timeHours > 21 || (timeHours === 21 && timeMinutes >= 30)) {
    return next({
      status: 400,
      message:
        "Reservation time must be at 9:30 pm, or earlier, the restaurant will be closed at 10:30 pm.",
    });
  }
  return next();
}

// POST validation, returns 400 if status is 'seated'
function reservationIsSeated(req, res, next) {
  const reservation = req.body.data;
  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: "Cannot created a reservation with a status of seated.",
    });
  }
  return next();
}

// POST validation returns 400 if status is 'finished'
function reservationIsFinished(req, res, next) {
  const reservation = req.body.data;
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "Cannot created a reservation with a status of finished.",
    });
  }
  return next();
}

// create reservation
async function createReservation(req, res) {
  const data = await service.createReservation(req.body.data);
  res.status(201).json({ data });
}

// PUT, validation to check if
// body and id
function statusCannotBeFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: "Status cannot be updated if it is finished.",
    });
  }
  return next();
}

// PUT validation
// status can be booked, seated, finished, if not return next({status:400, message: "unknown status"})
async function unknownStatus(req, res, next) {
  const { status } = req.body.data;
  if (
    status !== "booked" &&
    status !== "seated" &&
    status !== "finished" &&
    status !== "cancelled"
  ) {
    return next({
      status: 400,
      message: "unknown status.",
    });
  }
  return next();
}

// update status to "cancelled", validation first_name, 400 missing or empty
function firstNameValid(req, res, next) {
  const { first_name } = req.body.data;
  if (!first_name) {
    return next({
      status: 400,
      message: "first_name missing, or does not exist",
    });
  }
  return next();
}

// update status to "cancelled", validation last_name, 400 missing or empty
function lastNameValid(req, res, next) {
  const { last_name } = req.body.data;
  if (!last_name) {
    return next({
      status: 400,
      message: "last_name missing, or does not exist",
    });
  }
  return next();
}

// update status to "cancelled", validation first_name, 400 missing or empty
function mobileNumberValid(req, res, next) {
  const { mobile_number } = req.body.data;
  const mobile_number_regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  // console.log("************", req.body)
  if (mobile_number && mobile_number_regex.test(mobile_number)) {
    return next();
  }
  return next({
    status: 400,
    message:
      "mobile_number missing, does not exist, or needs to consist of numbers",
  });
}

// update status to "cancelled", validation reservation_date, 400 missing or empty, or not a date
function reservationDateValid(req, res, next) {
  const date = req.body.data.reservation_date;
  let date_regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  if (date && date_regex.test(date)) {
    return next();
  }
  return next({
    status: 400,
    message: "reservation_date is a required field, and must be a date",
  });
}

function reservationTimeValid(req, res, next) {
  const time = req.body.data.reservation_time;
  let time_regex = /^(2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
  if (time && time_regex.test(time)) {
    return next();
  }
  next({ status: 400, message: "reservation_time must be a time" });
}

function peopleValid(req, res, next) {
  const { people } = req.body.data;
  // if people is not a number
  if (!Number.isInteger(people) || Math.sign(people) === -1 || people === 0) {
    return next({
      status: 400,
      message:
        "people field must contain a number, and must be greater than zero.",
    });
  }
  return next();
}

// PUT, need an id and body
// update a
async function update(req, res, next) {
  const reservation = req.body.data;
  const { reservationId } = req.params;
  const updatedReservation = {
    reservation_id: reservationId,
    status: reservation.status,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

async function updateEditReservation(req, res, next) {
  const reservation = req.body.data;
  const { reservationId } = req.params;
  const updatedReservation = {
    reservation_id: reservationId,
    first_name: reservation.first_name,
    last_name: reservation.last_name,
    mobile_number: reservation.mobile_number,
    reservation_date: reservation.reservation_date,
    reservation_time: reservation.reservation_time,
    people: reservation.people,
    status: reservation.status,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
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
    mobileNumberValid,
    hasProperties("reservation_date"),
    hasProperties("reservation_time"),
    hasProperties("people"),
    reservationDateValidator,
    reservationTimeValidator,
    peopleValid,
    closedOnTuesdaysValidator,
    futureReservationsOnlyValidator,
    timeConstraintsToCreateReservations,
    reservationIsSeated,
    reservationIsFinished,
    asyncErrorBoundary(createReservation),
  ],
  //  /status
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(unknownStatus),
    statusCannotBeFinished,
    asyncErrorBoundary(update),
  ],
  updateEditReservation: [
    asyncErrorBoundary(reservationExists),
    firstNameValid,
    lastNameValid,
    mobileNumberValid,
    reservationDateValid,
    futureReservationsOnlyValidator,
    closedOnTuesdaysValidator,
    reservationTimeValid,
    timeConstraintsToCreateReservations,
    peopleValid,
    asyncErrorBoundary(updateEditReservation),
  ],
};

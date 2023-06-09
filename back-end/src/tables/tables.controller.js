const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service");

// GET /resevations/date=XXXX-XX-XX validation

async function list(req, res, next) {
  const data = await service.list();
  return res.json({ data });
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table id ${req.params.table_id} does not exist`,
  });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `${reservation_id} does not exist.` });
}

// for delete method
async function reservationExistsInTable(req, res, next) {
  //reservation_id exists in a table
  const { reservation_id } = res.locals.table;
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `${reservation_id} does not exist.` });
}

function read(req, res, next) {
  const { table } = res.locals;
  const data = table;
  res.json({ data });
}

const validProperties = ["table_name", "capacity"];

function hasProperties(...validProperties) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    try {
      validProperties.forEach((property) => {
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

function tableCharacterLengthValidator(req, res, next) {
  const tableName = req.body.data.table_name;
  if (tableName.length === 1) {
    next({
      status: 400,
      message: "table_name must be longer than one character.",
    });
  }
  return next();
}

function capacityIsANumberValidator(req, res, next) {
  const tableCapacity = req.body.data.capacity;
  if (!Number.isInteger(tableCapacity) || tableCapacity === 0) {
    next({ status: 400, message: "capacity must be a number" });
  }
  return next();
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

// validate data exists, middleware for update function
async function dataExists(req, res, next) {
  const data = await req.body.data;
  if (data) {
    return next();
  }
  return next({ status: 400, message: "There is no data" });
}

async function reservationIdMissing(req, res, next) {
  const { reservation_id } = await req.body.data;
  if (!reservation_id) {
    return next({ status: 400, message: "reservation_id does not exist." });
  }
  return next();
}

function capacitySufficientValidator(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message: "Table does not have sufficient capacity.",
    });
  }
  return next();
}

// if a table is occupied return 400
// how to tell if a table is occupied when a reserveration_id from table, is not null
function tableIsOccupied(req, res, next) {
  const { table } = res.locals;
  if (table.reservation_id !== null) {
    return next({ status: 400, message: "Table is occupied." });
  }
  return next();
}

// used for PUT so it needs a body and an id
async function updateReservationSeated(req, res, next) {
  const reservation = res.locals.reservation;
  const updatedReservation = {
    reservation_id: reservation.reservation_id,
    status: "seated",
  };
  await reservationService.update(updatedReservation);
  next();
}

// used for DELETE method, needs an id
async function updateReservationFinished(req, res, next) {
  const reservation = res.locals.reservation;
  const updatedReservation = {
    reservation_id: reservation.reservation_id,
    status: "finished",
  };
  await reservationService.update(updatedReservation);
  next();
}

// validation for put request
// returns 400 if reservation is already seated
function reservationIsSeated(req, res, next) {
  const { reservation } = res.locals;
  // reservation is already seated if the status is seated
  if (reservation.status === "seated") {
    return next({ status: 400, message: "Reservation is already seated." });
  }
  return next();
}

// put request to update, needs an table_id and a body
async function update(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  const updatedTable = {
    table_id: table.table_id,
    reservation_id: reservation.reservation_id,
  };
  const data = await service.update(updatedTable);
  res.json({ data });
}

function tableIsNotOccupied(req, res, next) {
  const { table } = res.locals;
  if (table.reservation_id === null) {
    return next({ status: 400, message: "Table is not occupied" });
  }
  return next();
}

async function destroy(req, res, next) {
  const table = res.locals.table;
  const updatedTable = {
    table_id: table.table_id,
    reservation_id: null,
  };
  const data = await service.update(updatedTable);
  return res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(tableExists), read],
  create: [
    hasProperties("table_name"),
    hasProperties("capacity"),
    tableCharacterLengthValidator,
    capacityIsANumberValidator,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(dataExists),
    asyncErrorBoundary(reservationIdMissing),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    capacitySufficientValidator,
    tableIsOccupied,
    reservationIsSeated,
    asyncErrorBoundary(updateReservationSeated),
    asyncErrorBoundary(update),
  ],
  destroy: [
    asyncErrorBoundary(tableExists),
    tableIsNotOccupied,
    asyncErrorBoundary(reservationExistsInTable),
    asyncErrorBoundary(updateReservationFinished),
    asyncErrorBoundary(destroy),
  ],
};

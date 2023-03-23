const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service");

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
  next({ status: 400, message: "Reservation does not exist." });
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
function dataExists(req, res, next) {
  const data = req.body.data;
  if (data) {
    return next();
  }
  return next({ status: 400, message: "There is no data" });
}

// exists means defined or initalized

// missing means what? null?

function capacitySufficientValidator(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message: "Table does not have sufficient capacity.",
    });
  }
  if (table.capacity >= reservation.people) return next();
}

// put request to update, needs an table_id and a body
async function update(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  // console.log("*************** table", table)
  // console.log("*************** reservation", reservation);
  const updatedTable = {
    ...table.reservation_id,
    reservation_id: reservation.reservation_id,
  };
  const data = await service.update(updatedTable);
  res.json({ data });
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
    dataExists,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    capacitySufficientValidator,
    asyncErrorBoundary(update),
  ],
};

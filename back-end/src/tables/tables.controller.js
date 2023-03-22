const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  const data = await service.list();
  return res.json({ data });
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    table = res.locals.table;
    return next();
  }
  next({
    status: 404,
    message: `Table id ${req.params.table_id} does not exist`,
  });
}

function read(req, res, next) {
  const { table } = res.locals;
  const data = table;
  res.json({ data });
}

const validProperties = ["table_name", "capacity"];

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

// put request to update, needs an table_id and a body
async function update(req, res, next) {
  const updatedTable = {
    ...res.locals.table,
    ...req.body.data,
  };
  const data = await service.update(updatedTable);
  res.json({ data });
}

// if a table is occupied, it will  have a reservation_id
// NOT OCCUPIED, it will not have a reservation_id

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
  update: [asyncErrorBoundary(update)],
};

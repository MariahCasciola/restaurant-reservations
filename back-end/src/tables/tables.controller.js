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
  next({ status: 404, message: `Table id ${req.params.table_id} does not exist` });
}

function read(req, res, next) {
  const { table } = res.locals;
  const data = table;
  res.json({ data });
}

async function create(req, res, next) {
  return next({ status: 500, message: "Get fucked idiot" });
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
  create: [asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(update)],
};

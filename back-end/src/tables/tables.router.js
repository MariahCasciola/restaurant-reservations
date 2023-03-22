const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/:table_id").get(controller.read).put(controller.update);

router.route("/").get(controller.list).post(controller.create);

module.exports = router;

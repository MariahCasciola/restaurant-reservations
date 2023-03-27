const router = require("express").Router();
const controller = require("./tables.controller");

router
  .route("/:table_id/seat")
  .put(controller.update)
  .delete(controller.destroy);

router.route("/:table_id").get(controller.read);

router.route("/").get(controller.list).post(controller.create);

module.exports = router;

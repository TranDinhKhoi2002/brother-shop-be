const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const staffController = require("../controllers/staff");

router.post("/staffs/create", isAuth, staffController.createStaff);

module.exports = router;

const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const staffController = require("../controllers/staff");

//sửa is Auth
router.post("/staffs/create", staffController.createStaff);

module.exports = router;

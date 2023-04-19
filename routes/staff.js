const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const staffController = require("../controllers/staff");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const { createStaffValidations } = require("../validations/staff");

//sửa is Auth
router.post("/staffs/create", createStaffValidations, validationErrorHandler, staffController.createStaff);

module.exports = router;

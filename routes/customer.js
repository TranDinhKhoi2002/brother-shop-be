const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const customerController = require("../controllers/customer");

router.post("/customer/update-profile", isAuth, customerController.updateProfile);

module.exports = router;

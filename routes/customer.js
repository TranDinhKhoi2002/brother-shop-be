const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const customerController = require("../controllers/customer");

router.post("/customer/update-profile", isAuth, customerController.updateProfile);

router.post("/customer/verify-phone-number", isAuth, customerController.verifyPhoneNumber);

router.post("/customer/user-is-verified", isAuth, customerController.updateUserIsVerified);

router.post("/customer/change-password", isAuth, customerController.changePassword);

module.exports = router;

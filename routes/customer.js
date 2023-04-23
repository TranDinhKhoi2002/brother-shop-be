const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const customerController = require("../controllers/customer");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const {
  updateProfileValidations,
  verifyPhoneNumberValidations,
  changePasswordValidations,
  addAddressValidations,
} = require("../validations/customer");

router.post(
  "/customer/update-profile",
  isAuth,
  updateProfileValidations,
  validationErrorHandler,
  customerController.updateProfile
);

router.post(
  "/customer/verify-phone-number",
  isAuth,
  verifyPhoneNumberValidations,
  validationErrorHandler,
  customerController.verifyPhoneNumber
);

router.post("/customer/user-is-verified", isAuth, customerController.updateUserIsVerified);

router.post(
  "/customer/change-password",
  isAuth,
  changePasswordValidations,
  validationErrorHandler,
  customerController.changePassword
);

router.post(
  "/customer/add-address",
  isAuth,
  addAddressValidations,
  validationErrorHandler,
  customerController.addAddress
);

module.exports = router;

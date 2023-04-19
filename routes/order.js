const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const { createOrderValidations, checkOutOrderValidations } = require("../validations/order");

router.post("/orders/create-order", createOrderValidations, validationErrorHandler, orderController.createOrder);

router.put("/orders/check-out", checkOutOrderValidations, validationErrorHandler, orderController.checkOutOrder);

module.exports = router;

const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");

router.post("/orders/create-order", orderController.createOrder);

router.put("/orders/check-out", orderController.checkOutOrder);

module.exports = router;

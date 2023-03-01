const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");

router.post("/orders/create-order", orderController.createOrder);

router.put("/orders/update-paid/:orderId", orderController.updateOrderPaid);

module.exports = router;

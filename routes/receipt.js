const express = require("express");
const router = express.Router();

const receiptController = require("../controllers/receipt");
const { createReceiptValidations } = require("../validations/receipt");
const validationErrorHandler = require("../middleware/validationErrorHandler");

router.get("/receipts", receiptController.getReceipts);

router.get("/receipts/:receiptId", receiptController.getReceiptById);

//sửa is Auth
router.post("/receipts/create", createReceiptValidations, validationErrorHandler, receiptController.importGoods);

module.exports = router;

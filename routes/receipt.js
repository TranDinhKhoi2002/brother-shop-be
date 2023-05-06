const express = require("express");
const router = express.Router();

const receiptController = require("../controllers/receipt");

router.get("/receipts", receiptController.getReceipts);

router.get("/receipts/:receiptId", receiptController.getReceiptById);

//sửa is Auth
router.post("/receipts/import-goods", receiptController.importGoods);

module.exports = router;

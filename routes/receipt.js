const express = require("express");
const router = express.Router();

const receiptController = require("../controllers/receipt");
const isAuth = require("../middleware/is-auth");

router.post("/receipts/import-goods", isAuth, receiptController.importGoods);

module.exports = router;

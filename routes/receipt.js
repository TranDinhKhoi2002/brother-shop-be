const express = require("express");
const router = express.Router();

const receiptController = require("../controllers/receipt");
const isAuth = require("../middleware/is-auth");

//sửa is Auth
router.post("/receipts/import-goods", receiptController.importGoods);

module.exports = router;

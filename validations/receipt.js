const { body } = require("express-validator");

const validator = {
  supplier: body("supplier", "Tên nhà cung cấp không được để trống").notEmpty().trim(),
  staff: body("staff").isMongoId().withMessage("Mã nhân viên không hợp lệ"),
  date: body("date", "Ngày sinh không hợp lệ").isISO8601(),
  products: body("products").isArray().withMessage("Danh sách sản phẩm không hợp lệ"),
};

const createReceiptValidations = [validator.supplier, validator.staff, validator.date, validator.products];

module.exports = { createReceiptValidations };

const { body, param } = require("express-validator");

const validator = {
  name: body("name", "Tên khuyến mãi không được rỗng").notEmpty().trim(),
  description: body("description", "Mô tả khuyến mãi không được rỗng").notEmpty().trim(),
  percentage: body("percentage").isInt({ min: 5, max: 100 }).withMessage("Phần trăm khuyến mãi không hợp lệ"),
  startDate: body("startDate", "Ngày bắt đầu không hợp lệ").isISO8601().toDate(),
  endDate: body("endDate", "Ngày kết thúc không hợp lệ").isISO8601().toDate(),
  amount: body("amount").isInt().withMessage("Số lượng khuyến mãi không hợp lệ"),
  minPrice: body("minPrice").isInt().withMessage("Số lượng khuyến mãi không hợp lệ"),
  promotionId: param("promotionId").isMongoId().withMessage("Mã sản phẩm không hợp lệ"),
};

const createPromotionValidations = [
  validator.name,
  validator.description,
  validator.percentage,
  validator.startDate,
  validator.endDate,
  validator.amount,
  validator.minPrice,
];

const editPromotionValidations = [
  validator.name,
  validator.description,
  validator.percentage,
  validator.startDate,
  validator.endDate,
  validator.amount,
  validator.promotionId,
  validator.minPrice,
];

const deletePromotionValidations = [validator.promotionId];

module.exports = {
  createPromotionValidations,
  deletePromotionValidations,
  editPromotionValidations,
};

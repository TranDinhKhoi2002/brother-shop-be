const { body, param } = require("express-validator");

const validator = {
  name: body("name", "Tên khuyến mãi không được rỗng").notEmpty().trim(),
  categories: body("categories").isArray().withMessage("Danh sách danh mục không hợp lệ"),
  percentage: body("percentage").isInt({ min: 5, max: 100 }).withMessage("Phần trăm khuyến mãi không hợp lệ"),
  startDate: body("startDate", "Ngày bắt đầu không hợp lệ").isISO8601().toDate(),
  endDate: body("endDate", "Ngày kết thúc không hợp lệ").isISO8601().toDate(),
  promotionId: param("promotionId").isMongoId().withMessage("Mã sản phẩm không hợp lệ"),
};

const createPromotionValidations = [
  validator.name,
  validator.categories,
  validator.percentage,
  validator.startDate,
  validator.endDate,
  validator.promotionId,
];

module.exports = {
  createPromotionValidations,
};

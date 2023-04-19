const { body } = require("express-validator");

const validator = {
  product: body("product").isObject().withMessage("Sản phẩm không hợp lệ"),
  productId: body("productId").isMongoId().withMessage("Mã sản phẩm không hợp lệ"),
};

const addToWishlistValidations = [validator.product];

const removeFromWishlistValidations = [validator.productId];

module.exports = { addToWishlistValidations, removeFromWishlistValidations };

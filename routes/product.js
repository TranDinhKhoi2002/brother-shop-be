const express = require("express");
const router = express.Router();

const productController = require("../controllers/product");

router.get("/products", productController.getProducts);

router.get("/products/hot-products", productController.getHotProducts);

router.get("/products/discount-products", productController.getDiscountProducts);

router.get("/products/type/:typeName", productController.getProductsByType);

router.get("/products/search/:keyword", productController.getProductsByKeyword);

router.get("/products/filters", productController.getProductsByFilters);

router.get("/products/:productId", productController.getProductById);

module.exports = router;

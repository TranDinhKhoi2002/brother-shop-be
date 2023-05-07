const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category");
const {
  createCategoryValidations,
  updateCategoryValidations,
  deleteCategoryValidations,
} = require("../validations/category");
const validationErrorHandler = require("../middleware/validationErrorHandler");

router.get("/categories", categoryController.getCategories);

router.get("/categories/:categoryId/products", categoryController.getProductsByCategory);

router.post("/categories/create", createCategoryValidations, validationErrorHandler, categoryController.createCategory);

router.put("/categories/update", updateCategoryValidations, validationErrorHandler, categoryController.updateCategory);

router.delete(
  "/categories/delete",
  deleteCategoryValidations,
  validationErrorHandler,
  categoryController.deleteCategory
);

module.exports = router;

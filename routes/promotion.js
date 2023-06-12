const express = require("express");
const router = express.Router();

const isStaffAuth = require("../middleware/isStaffAuth");
const promotionController = require("../controllers/promotion");
const { createPromotionValidations } = require("../validations/promotion");
const validationErrorHandler = require("../middleware/validationErrorHandler");

router.get("/promotions", isStaffAuth, promotionController.getPromotions);

router.get("/promotions/:promotionId", isStaffAuth, promotionController.getPromotionById);

router.post(
  "/promotions",
  isStaffAuth,
  createPromotionValidations,
  validationErrorHandler,
  promotionController.createPromotion
);

module.exports = router;

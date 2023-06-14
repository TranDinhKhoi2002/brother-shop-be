const Promotion = require("../models/promotion");
const Category = require("../models/category");
const AppError = require("../util/error");

exports.getPromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find().populate("categories");
    res.status(200).json({ promotions });
  } catch (error) {
    next(error);
  }
};

exports.getPromotionById = async (req, res, next) => {
  const promotionId = req.params.promotionId;

  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new AppError(404, "Khuyễn mãi không tồn tại");
    }

    res.status(200).json({ promotion });
  } catch (error) {
    next(error);
  }
};

exports.createPromotion = async (req, res, next) => {
  const { name, categories, percentage, startDate, endDate } = req.body;

  try {
    for (const categoryId of categories) {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new AppError(404, "Danh mục sản phẩm không tồn tại");
      }
    }

    const promotion = new Promotion({
      name,
      categories,
      percentage,
      startDate,
      endDate,
    });
    await promotion.save();

    res.status(201).json({ promotion, message: "Tạo khuyến mãi thành công" });
  } catch (error) {
    next(error);
  }
};

exports.editPromotion = async (req, res, next) => {
  const { name, categories, percentage, startDate, endDate } = req.body;
  const promotionId = req.params.promotionId;

  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new AppError(404, "Khuyến mãi không tồn tại");
    }

    for (const categoryId of categories) {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new AppError(404, "Danh mục sản phẩm không tồn tại");
      }
    }

    promotion.name = name;
    promotion.categories = categories;
    promotion.percentage = percentage;
    promotion.startDate = startDate;
    promotion.endDate = endDate;
    await promotion.save();

    res.status(200).json({ message: "Cập nhật khuyến mãi thành công" });
  } catch (error) {
    next(error);
  }
};

exports.deletePromotion = async (req, res, next) => {
  const promotionId = req.params.promotionId;

  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new AppError(404, "Khuyến mãi không tồn tại");
    }

    await Promotion.findByIdAndDelete(promotionId);
    res.status(200).json({ message: "Xóa khuyến mãi thành công" });
  } catch (error) {
    next(error);
  }
};

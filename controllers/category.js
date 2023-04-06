const Category = require("../models/category");

exports.getProductsByCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await Category.findById(categoryId)
      .populate("products")
      .populate({ path: "types", populate: "products" });

    if (!category) {
      const categories = await Category.find().populate("products").populate({ path: "types", populate: "products" });
      const currentCategory = categories.find(
        (category) => category.types.findIndex((item) => item._id.toString() === categoryId) !== -1
      );

      const currentType = currentCategory.types.find((item) => item._id.toString() === categoryId);
      return res.status(200).json({ products: currentType.products, categoryName: currentType.type });
    }

    const products = category.products;

    res.status(200).json({ products, categoryName: category.name });
  } catch (err) {
    const error = new Error("Đã có lỗi xảy ra");
    error.statusCode = 500;
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (err) {
    const error = new Error("Đã có lỗi xảy ra");
    error.statusCode = 500;
    next(error);
  }
};

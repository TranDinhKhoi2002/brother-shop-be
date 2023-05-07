const Category = require("../models/category");
const AppError = require("../util/error");

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
  } catch (error) {
    const err = new AppError(500, "Đã có lỗi xảy ra");
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    const err = new AppError(500, "Đã có lỗi xảy ra");
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  const { name, types } = req.body;

  try {
    const formattedTypes = types.map((type) => ({ type, products: [] }));

    const category = new Category({
      name,
      types: formattedTypes,
      products: [],
    });
    await category.save();

    res.status(201).json({ message: "Thêm danh mục sản phẩm thành công" });
  } catch (error) {
    const err = new AppError(500, "Đã có lỗi xảy ra");
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  const { name, types, categoryId } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new AppError(404, "Danh mục không tồn tại");
    }

    category.name = name;
    category.types = types;
    await category.save();

    res.status(200).json({ message: "Cập nhật danh mục sản phẩm thành công", updatedCategory: category });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const { categoryId } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new AppError(404, "Danh mục không tồn tại");
    }

    if (category.products.length > 0) {
      throw new AppError(422, "Không thể xóa danh mục đang chứa sản phẩm");
    }

    await Category.findByIdAndRemove(categoryId);
  } catch (error) {
    next(error);
  }
};

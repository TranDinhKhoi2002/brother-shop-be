const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Không tìm thấy sản phẩm");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ product });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.getHotProducts = async (req, res, next) => {
  try {
    const sortedProducts = await Product.find().sort({ totalSold: -1 }).limit(12).exec();
    res.status(200).json({ products: sortedProducts });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.getDiscountProducts = async (req, res, next) => {
  try {
    const discountProducts = await Product.find({ oldPrice: { $ne: null } });
    res.status(200).json({ products: discountProducts });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.getProductsByType = async (req, res, next) => {
  const typeName = req.params.typeName;

  try {
    const products = await Product.find({ name: { $regex: typeName } }).populate("category");
    res.status(200).json({ products });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

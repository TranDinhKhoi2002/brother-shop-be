const { ITEMS_PER_PAGE, sizes } = require("../constants");
const Category = require("../models/category");
const Product = require("../models/product");
const { cloudinary } = require("../util/cloudinary");
const AppError = require("../util/error");

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

exports.getProductsByKeyword = async (req, res, next) => {
  const keyword = req.params.keyword;
  const page = +req.query.page || 1;

  try {
    const products = await Product.find({ name: { $regex: keyword, $options: "i" } })
      .populate("category")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    const totalItems = await Product.find({ name: { $regex: keyword, $options: "i" } }).countDocuments();

    res.status(200).json({
      products,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.getProductsByFilters = async (req, res, next) => {
  try {
    const category = await Category.findOne({ "types._id": req.query.categoryId }).populate("products").populate({
      path: "types",
      populate: "products",
    });
    if (!category) {
      return res.status(200).json({ products: [] });
    }

    let products = category.products;

    if (req.query.types !== "null") {
      products = [];

      const types = req.query.types.split(",");
      const categoryTypes = category.types;

      for (const type of types) {
        const categoryType = categoryTypes.find((item) => item.type === type);
        products.push(...categoryType.products);
      }
    }

    if (req.query.priceFrom !== "null" && req.query.priceTo !== "null") {
      const priceFrom = +req.query.priceFrom;
      const priceTo = +req.query.priceTo;

      products = products.filter((product) => product.price >= priceFrom && product.price <= priceTo);
    }

    if (req.query.materials !== "null") {
      const materials = req.query.materials.split(",");
      products = products.filter(
        (product) =>
          materials.findIndex((item) => product.description.toLowerCase().includes(item.toLowerCase())) !== -1
      );
    }

    if (req.query.textures !== "null") {
      const textures = req.query.textures.split(",");
      products = products.filter(
        (product) => textures.findIndex((item) => product.description.toLowerCase().includes(item.toLowerCase())) !== -1
      );
    }

    res.status(200).json({ products });
  } catch (error) {
    next(new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau"));
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, categoryId, price, description, mainImg, subImg, mainFolder, subFolder } = req.body;

    const mainImgResponse = cloudinary.uploader.upload(mainImg, {
      folder: mainFolder,
    });

    const subImgResponse = cloudinary.uploader.upload(subImg, {
      folder: subFolder,
    });

    const [mainImgResult, subImgResult] = await Promise.all([mainImgResponse, subImgResponse]);

    const product = new Product({
      name,
      category: categoryId,
      price,
      description,
      images: { mainImg: mainImgResult.public_id, subImg: subImgResult.public_id },
      sizes: Object.values(sizes).map((size) => ({ name: size, quantity: 0, sold: 0 })),
    });
    await product.save();

    const categoryWithNoTypes = await Category.findById(categoryId);
    if (categoryWithNoTypes) {
      categoryWithNoTypes.products.push(product._id);
      return res.status(201).json({ message: "Tạo sản phẩm thành công", product });
    }

    const categories = await Category.find();
    const currentCategory = categories.find(
      (category) => category.types.findIndex((item) => item._id.toString() === categoryId) !== -1
    );

    if (!currentCategory) {
      throw new AppError(422, "Mã danh mục không tồn tại");
    }

    const currentTypeIndex = currentCategory.types.findIndex((item) => item._id.toString() === categoryId);
    currentCategory.types[currentTypeIndex].products.push(product._id);
    currentCategory.products.push(product._id);
    await currentCategory.save();

    res.status(201).json({ message: "Tạo sản phẩm thành công", product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {};

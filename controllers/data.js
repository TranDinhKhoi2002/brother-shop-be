const Customer = require("../models/customer");
const Category = require("../models/category");

exports.getCommonData = async (req, res, next) => {
  try {
    const categories = await Category.find();

    const accountId = req.query.accountId;
    if (!accountId || accountId === "undefined") {
      return res.status(200).json({ categories });
    }

    const customer = await Customer.findOne({ account: accountId }).populate({ path: "cart", populate: "productId" });
    if (!customer) {
      const error = new Error("Không tìm thấy khách hàng");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ categories, customer });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

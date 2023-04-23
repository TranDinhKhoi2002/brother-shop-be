const jwt = require("jsonwebtoken");

const Customer = require("../models/customer");
const Category = require("../models/category");
const AppError = require("../util/error");

exports.getCommonData = async (req, res, next) => {
  try {
    const categories = await Category.find();

    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, "secret");
    } catch (error) {
      return res.status(200).json({ categories });
    }

    const customerId = decodedToken.customerId;

    const customer = await Customer.findById(customerId)
      .populate("account")
      .populate("cart.productId")
      .populate("orders");

    res.status(200).json({ categories, customer: customer });
  } catch (error) {
    const err = new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau");
    next(err);
  }
};

const Product = require("../models/product");
const Staff = require("../models/staff");
const Customer = require("../models/customer");
const Order = require("../models/order");

exports.getStatCardData = async (req, res, next) => {
  try {
    const [products, staffs, customers, orders] = await Promise.all([
      Product.find().countDocuments(),
      Staff.find().countDocuments(),
      Customer.find().countDocuments(),
      Order.find().countDocuments(),
    ]);

    res.status(200).json({ products, staffs, customers, orders });
  } catch (error) {
    next(error);
  }
};

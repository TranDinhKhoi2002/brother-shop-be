const Product = require("../models/product");
const Staff = require("../models/staff");
const Customer = require("../models/customer");
const Order = require("../models/order");
const Category = require("../models/category");
const { orderPaymentStatuses } = require("../constants");

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

exports.getRevenue = async (req, res, next) => {
  const days = parseInt(req.params.days);

  try {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - days);

    const orders = await Order.find({ paymentStatus: orderPaymentStatuses.PAID, createdAt: { $gte: lastWeek } });

    const data = orders.map((order) => ({
      date: new Date(order.createdAt).toLocaleDateString(),
      revenue: order.totalProductsPrice,
    }));

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

exports.getBestSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ totalSold: -1 }).limit(5);
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

exports.getPercentageCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate("products");

    let total = 0;
    const soldData = categories.map((category) => {
      const totalSold = category.products.reduce((acc, cur) => {
        return acc + cur.totalSold;
      }, 0);
      total += totalSold;

      return {
        name: category.name,
        value: totalSold,
      };
    });

    soldData.forEach((item) => {
      item.value = parseFloat(((item.value / total) * 100).toFixed(2));
    });

    res.status(200).json({ data: soldData });
  } catch (error) {
    next(error);
  }
};

exports.getSoldQuantityProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    const soldQuantityProducts = products.map((product) => ({ name: product.name, sold: product.totalSold }));

    res.status(200).json({ data: soldQuantityProducts });
  } catch (error) {
    next(error);
  }
};

exports.getTrendOfCategories = async (req, res, next) => {
  try {
    const orders = await Order.find({ paymentStatus: orderPaymentStatuses.PAID }).populate("products.product");

    const data = [];
    for (const order of orders) {
      const items = [];

      for (const product of order.products) {
        const category = await Category.findById(product.product.category);

        const existingItemIndex = items.findIndex(
          (item) => item.category === category.name && item.date === new Date(order.createdAt).toLocaleDateString()
        );

        if (existingItemIndex === -1) {
          const item = {
            category: category.name,
            date: new Date(order.createdAt).toLocaleDateString(),
            sold: product.amount,
          };

          items.push(item);
        } else {
          items[existingItemIndex].sold += product.amount;
        }
      }

      data.push(...items);
    }

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

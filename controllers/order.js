const sgMail = require("@sendgrid/mail");

const Order = require("../models/order");
const Customer = require("../models/customer");
const Product = require("../models/product");

const AppError = require("../util/error");
const { orderPaymentStatuses } = require("../constants");
const { printNumberWithCommas } = require("../util/printNumberWithCommas");

sgMail.setApiKey(process.env.SG_API_KEY);

exports.createOrder = async (req, res, next) => {
  const {
    toName,
    toPhone,
    toEmail,
    toAddress,
    toNote,
    products,
    totalProductsPrice,
    shippingPrice,
    totalPrice,
    companyName,
    companyAddress,
    companyTaxNumber,
    paymentMethod,
    customerId,
  } = req.body;

  try {
    const order = new Order({
      toName,
      toPhone,
      toEmail,
      toAddress,
      toNote,
      products,
      totalProductsPrice,
      totalPrice,
      paymentMethod,
      companyName: companyName === "" ? undefined : companyName,
      companyAddress: companyAddress === "" ? undefined : companyAddress,
      companyTaxNumber: companyTaxNumber === "" ? undefined : companyTaxNumber,
    });
    await order.save();

    for (const item of order.products) {
      const existingProduct = await Product.findById(item.product);
      if (existingProduct) {
        const selectedSizeIndex = existingProduct.sizes.findIndex((size) => size.name === item.size);
        existingProduct.sizes[selectedSizeIndex].sold += item.amount;
        await existingProduct.save();
      }
    }

    products.forEach((product) => {
      product.price = printNumberWithCommas(product.price);
    });

    await sgMail.send({
      to: toEmail,
      from: process.env.SG_FROM_EMAIL,
      templateId: process.env.SG_CONFIRM_ORDER_TEMPLATE_ID,
      dynamicTemplateData: {
        products,
        orderId: order._id.toString().slice(0, 8).toUpperCase(),
        toName,
        toAddress,
        toPhone,
        toEmail,
        createdAt: new Date().toLocaleString(),
        totalProductsPrice: printNumberWithCommas(totalProductsPrice),
        shippingPrice: printNumberWithCommas(shippingPrice),
        totalPrice: printNumberWithCommas(totalPrice),
      },
    });

    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (customer) {
        customer.cart = [];
        customer.orders.push(order._id);
        await customer.save();
      }
    }

    res.status(200).json({ message: "Đặt hàng thành công", orderId: order._id });
  } catch (error) {
    const err = new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau");
    next(err);
  }
};

exports.checkOutOrder = async (req, res, next) => {
  const orderId = req.body.orderId;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError(404, "Không tìm thấy đơn hàng");
    }

    order.paymentStatus = orderPaymentStatuses.PAID;
    await order.save();

    res.status(200).json({ message: "Thanh toán đơn hàng thành công", cart: [] });
  } catch (error) {
    next(error);
  }
};

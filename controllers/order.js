require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const Order = require("../models/order");
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
      shippingPrice,
      totalPrice,
      companyName: companyName === "" ? undefined : companyName,
      companyAddress: companyAddress === "" ? undefined : companyAddress,
      companyTaxNumber: companyTaxNumber === "" ? undefined : companyTaxNumber,
    });
    await order.save();

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

    res.status(200).json({ message: "Đặt hàng thành công", orderId: order._id });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.updateOrderPaid = async (req, res, next) => {
  const orderId = req.params.orderId;

  // try {

  // } catch (err) {
  //   const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
  //   error.statusCode = 500;
  //   next(error);
  // }

  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error("Không tìm thấy đơn hàng");
    error.statusCode = 404;
    return next(error);
  }

  order.paymentStatus = orderPaymentStatuses.PAID;
  order.save();

  res.status(200).json({ message: "Cập nhật đơn hàng thành công" });
};

const Customer = require("../models/customer");
const AppError = require("../util/error");

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, birthday } = req.body;
    const customerId = req.customerId;

    const existingCustomer = await Customer.findOne({ phone: phone });
    if (existingCustomer) {
      throw new AppError(422, "Số điện thoại đã được sử dụng");
    }

    const customer = await Customer.findById(customerId);
    customer.name = name;
    customer.phone = phone;
    customer.birthday = birthday;
    await customer.save();

    res.status(201).json({ message: "Cập nhật thông tin thành công", updatedCustomer: customer });
  } catch (error) {
    next(error);
  }
};

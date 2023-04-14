const twilio = require("twilio");

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

exports.verifyPhoneNumber = async (req, res, next) => {
  const { phoneNumber } = req.body;

  const formatedPhoneNumber = "+84" + phoneNumber.slice(1);
  const otpCode = Math.floor(Math.random() * 1000000);

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  client.messages
    .create({
      body: `Mã xác minh của bạn là: ${otpCode}\nVui lòng không chia sẻ mã này cho bất kỳ ai`,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      to: formatedPhoneNumber,
    })
    .then((message) => res.status(200).json({ message: "Mã xác minh đã được gửi đến số điện thoại của bạn", otpCode }));
};

exports.updateUserIsVerified = async (req, res, next) => {
  const customerId = req.customerId;

  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new AppError(404, "Không tìm thấy khách hàng");
  }

  customer.verified = true;
  await customer.save();

  res.status(200).json({ message: "Xác thực tài khoản thành công" });
};

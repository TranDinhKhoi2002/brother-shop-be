const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");

const Account = require("../models/account");
const Customer = require("../models/customer");

sgMail.setApiKey(process.env.SG_API_KEY);

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const account = await Account.findOne({ username });
    if (!account) {
      const error = new Error("Tên đăng nhập không tồn tại");
      error.statusCode = 401;
      return next(error);
    }

    const isValidPassword = bcryptjs.compareSync(password, account.password);
    if (!isValidPassword) {
      const error = new Error("Mật khẩu không đúng");
      error.statusCode = 401;
      return next(error);
    }

    const customer = await Customer.findOne({ account: account._id })
      .populate("account")
      .populate("cart.productId")
      .populate("orders");

    const token = jwt.sign(
      {
        username: account.username,
        customerId: customer._id.toString(),
      },
      "secret",
      { expiresIn: "24h" }
    );

    res.status(200).json({ token, customerId: customer._id.toString(), user: customer });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.loginWithSocialMediaAccount = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    let customer = await Customer.findOne({ email: email })
      .populate("account")
      .populate("cart.productId")
      .populate("orders");
    if (!customer) {
      customer = new Customer({
        orders: [],
        wishlist: [],
        cart: [],
        name,
        address: "",
        email,
        phone: "",
        gender: "Nam",
        birthday: new Date(),
      });
      await customer.save();
    }

    const token = jwt.sign(
      {
        customerId: customer._id,
      },
      "secret",
      { expiresIn: "24h" }
    );

    res.status(200).json({ user: customer, token: token });
  } catch (error) {
    next(new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau"));
  }
};

exports.signup = async (req, res, next) => {
  const { name, email, password, phone, address, gender, birthday } = req.body;

  try {
    const existingEmail = await Customer.findOne({ email });
    if (existingEmail) {
      const error = new Error("Email đã được sử dụng");
      error.statusCode = 422;
      return next(error);
    }

    const existingPhone = await Customer.findOne({ phone });
    if (existingPhone) {
      const error = new Error("Số điện thoại đã được sử dụng");
      error.statusCode = 422;
      return next(error);
    }

    const hashedPassword = bcryptjs.hashSync(password, 12);
    const account = new Account({
      username: email,
      password: hashedPassword,
    });
    await account.save();

    const customer = new Customer({
      account: account._id,
      orders: [],
      cart: [],
      wishlist: [],
      name,
      address,
      email,
      phone,
      gender,
      birthday,
    });
    await customer.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email;

  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      return res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }

    const token = buffer.toString("hex");
    try {
      const customer = await Customer.findOne({ email });
      if (!customer) {
        return res.status(404).json({ message: "Email không tồn tại" });
      }

      const account = await Account.findById(customer.account);
      if (!account) {
        return res.status(404).json({ message: "Tài khoản không tồn tại" });
      }

      account.resetToken = token;
      account.resetTokenExpiration = Date.now() + 3600000;
      await account.save();

      sgMail.send({
        to: email,
        from: "20520224@gm.uit.edu.vn",
        templateId: process.env.SG_RESET_PASSWORD_TEMPLATE_ID,
        dynamicTemplateData: {
          token: token,
        },
      });

      res.status(200).json({
        message: "Gửi yêu cầu khôi phục mật khẩu thành công",
        accountId: account._id,
      });
    } catch (err) {
      const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
      error.statusCode = 500;
      next(error);
    }
  });
};

exports.resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    const existingAccount = await Account.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!existingAccount) {
      const error = new Error("Yêu cầu không còn hiệu lực");
      error.statusCode = 404;
      return next(error);
    }

    const hashedPassword = bcryptjs.hashSync(password, 12);

    existingAccount.password = hashedPassword;
    existingAccount.resetToken = undefined;
    existingAccount.resetTokenExpiration = undefined;
    await existingAccount.save();

    res.status(201).json({ message: "Thay đổi mật khẩu thành công" });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.checkResetToken = async (req, res, next) => {
  const token = req.body.token;

  try {
    const existingAccount = await Account.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!existingAccount) {
      return res.status(404).json({ isValidToken: false });
    }

    res.status(200).json({ isValidToken: true });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

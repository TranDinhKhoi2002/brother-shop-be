const bcryptjs = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

const Staff = require("../models/staff");
const AppError = require("../util/error");
const Account = require("../models/account");

sgMail.setApiKey(process.env.SG_API_KEY);

exports.createStaff = async (req, res, next) => {
  const { role, name, address, email, phone, gender, birthday } = req.body;

  try {
    const existingEmail = await Staff.findOne({ email });
    if (existingEmail) {
      throw new AppError(422, "Email đã được sử dụng");
    }

    const existingPhone = await Staff.findOne({ phone });
    if (existingPhone) {
      throw new AppError(422, "Số điện thoại đã được sử dụng");
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(randomPassword, 12);
    const account = new Account({ username: email, password: hashedPassword });
    await account.save();

    const staff = new Staff({
      account: account._id,
      role,
      name,
      address,
      email,
      phone,
      gender,
      birthday,
    });
    await staff.save();

    sgMail.send({
      to: email,
      from: process.env.SG_FROM_EMAIL,
      templateId: process.env.SG_SEND_PASSWORD_TEMPLATE_ID,
      dynamicTemplateData: {
        randomPassword,
      },
    });

    res.status(201).json({ message: "Thêm nhân viên thành công" });
  } catch (error) {
    next(error);
  }
};

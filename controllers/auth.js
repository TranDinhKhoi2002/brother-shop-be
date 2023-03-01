const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Account = require("../models/account");
const User = require("../models/user");

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

    const user = await User.findOne({ account: account._id }).populate("role").populate("account");

    const token = jwt.sign(
      {
        username: account.username,
        accountId: account._id.toString(),
      },
      "secret",
      { expiresIn: "1h" }
    );

    const role = user.role.name;

    res.status(200).json({ token, accountId: account._id.toString(), role, user });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

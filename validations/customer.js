const { body } = require("express-validator");
const { genders } = require("../constants");

const phoneRegEx = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

const validator = {
  name: body("name", "Tên không được để trống").notEmpty().trim(),
  phone: body("phoneNumber").trim().notEmpty().withMessage("Số điện thoại không được để trống").matches(phoneRegEx),
  birthday: body("birthday", "Ngày sinh không hợp lệ").isISO8601().toDate(),
  gender: body("gender").isIn(Object.values(genders)).withMessage("Giới tính không hợp lệ"),
  password: body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu phải có ít nhất 8 ký tự")
    .isAlphanumeric()
    .trim()
    .withMessage("Mật khẩu không hợp lệ"),
  detail: body("detail", "Vui lòng điền địa chỉ cụ thể").notEmpty().trim(),
  city: body("city", "Vui lòng chọn tỉnh/thành phố").notEmpty().trim(),
  district: body("district", "Vui lòng chọn quận/huyện").notEmpty().trim(),
  ward: body("ward", "Vui lòng chọn phường/xã").notEmpty().trim(),
};

const updateProfileValidations = [validator.name, validator.phone, validator.birthday, validator.gender];

const verifyPhoneNumberValidations = [validator.phone];

const changePasswordValidations = [validator.password];

const addAddressValidations = [
  validator.name,
  validator.phone,
  validator.detail,
  validator.city,
  validator.district,
  validator.ward,
];

module.exports = {
  updateProfileValidations,
  verifyPhoneNumberValidations,
  changePasswordValidations,
  addAddressValidations,
};

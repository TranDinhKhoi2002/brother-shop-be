/**
 * Define enum for models
 */

// Product States
const productStates = {
  ACTIVE: "Đang bán",
  PAUSE: "Nghỉ bán",
};

const orderShippingStatuses = {
  PREPARING: "Đang chuẩn bị",
  DELIVERING: "Đang giao",
  RECEIVED: "Đã nhận",
  CANCLED: "Đã hủy",
};

const orderPaymentStatuses = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
};

// Role Names
const roleNames = {
  OWNER: "Chủ quán",
  MANAGER: "Quản lý",
  STAFF: "Nhân viên",
  CLIENT: "Khách hàng",
};

// User: Gender & Status
const genders = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

const userStatus = {
  ACTIVE: "Đang làm",
  NONACTIVE: "Đã nghỉ",
};

const sizes = {
  SIZE_S: "S",
  SIZE_M: "M",
  SIZE_L: "L",
  SIZE_XL: "XL",
};

const ITEMS_PER_PAGE = 12;

module.exports = {
  productStates,
  orderShippingStatuses,
  orderPaymentStatuses,
  roleNames,
  genders,
  userStatus,
  sizes,
  ITEMS_PER_PAGE,
};

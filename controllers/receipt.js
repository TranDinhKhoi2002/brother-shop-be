const Staff = require("../models/staff");
const Product = require("../models/product");
const Receipt = require("../models/receipt");
const AppError = require("../util/error");

exports.importGoods = async (req, res, next) => {
  const { supplier, staff, date, deliver, products } = req.body;

  try {
    const existingStaff = await Staff.findById(staff);
    if (!existingStaff) {
      throw new AppError(404, "Nhân viên không tồn tại");
    }

    for (const product of products) {
      const existingProduct = await Product.findById(product.productId);
      if (!existingProduct) {
        throw new AppError(404, "Sản phẩm không tồn tại");
      }

      product.sizes.forEach((size) => {
        const existingSizeIndex = existingProduct.sizes.findIndex((existingSize) => existingSize.name === size.name);
        if (existingSizeIndex !== -1) {
          existingProduct.sizes[existingSizeIndex].quantity += size.quantity;
        }
      });

      await existingProduct.save();
    }

    const receipt = new Receipt({
      supplier,
      staff,
      date,
      deliver,
      products,
    });
    await receipt.save();

    res.status(200).json({ message: "Nhập hàng thành công" });
  } catch (error) {
    next(error);
  }
};

exports.getReceipts = async (req, res, next) => {
  try {
    const receipts = await Receipt.find().populate("staff").populate("products.productId");
    res.status(200).json({ receipts });
  } catch (error) {
    const err = new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau");
    next(err);
  }
};

exports.getReceiptById = async (req, res, next) => {
  const receiptId = req.params.receiptId;

  try {
    const receipt = await Receipt.findById(receiptId).populate("staff").populate("products.productId");
    if (!receipt) {
      throw new AppError(404, "Phiếu nhập hàng không tồn tại");
    }

    res.status(200).json({ receipt });
  } catch (error) {
    next(error);
  }
};

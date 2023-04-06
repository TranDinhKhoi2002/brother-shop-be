const mongoose = require("mongoose");
const { genders } = require("../constants");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  authAccountId: {
    type: String,
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  ],
  wishlist: [],
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: Object.values(genders),
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Customer", customerSchema);

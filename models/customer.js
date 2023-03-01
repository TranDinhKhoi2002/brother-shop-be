const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
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
    enum: genders,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Customer", customerSchema);

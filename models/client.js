const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { genders, userStatus } = require("../constants");

const userSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
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

module.exports = mongoose.model("User", userSchema);

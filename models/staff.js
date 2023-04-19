const mongoose = require("mongoose");
const { roleNames, genders } = require("../constants");
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
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
    enum: Object.values(genders),
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Staff", staffSchema);

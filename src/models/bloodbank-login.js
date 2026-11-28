const mongoose = require("mongoose");

const bloodBankLoginSchema = new mongoose.Schema(
  {
    bloodbankname: {
      type: String,
      required: true,
      trim: true,
    },
    bloodbankId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodBankLogin", bloodBankLoginSchema);
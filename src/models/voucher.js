const { boolean } = require("joi");
const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    discount: {
      type: Number,
      required: true,
    },
    expDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: boolean,
      required: true,
    },  
  },
  {
    timestamps: true,
  }
);

const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;

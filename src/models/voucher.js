const { boolean } = require("joi");
const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },


    isActive: {
      type: Boolean,
      required: true,
      default: true
    },  
  },
  {
    timestamps: true,
  }
);

const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;

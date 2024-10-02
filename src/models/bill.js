const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    product_price: {
      type: Number,
      required: true,
    },
    ship: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    state: {
      type: Number,
      required: true,
    },
    address_shipment: {
      type: String,
      required: true,
    },
    phone_shipment: {
      type: String,
      required: true,
    },
    lineItem: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LineItem",
      },
    ],
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
      required: false,
    },
    note: {
      type: String,
      required: false,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: false,
    },
  },
  {
    timestamps: true, 
  }
);

const Bill = mongoose.model("Bill", BillSchema);

module.exports = Bill;

const { boolean } = require("joi");
const mongoose = require("mongoose");

const lineitemSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Date,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }, 
  },
  {
    timestamps: true,
  }
);

const Lineitem = mongoose.model("Lineitem", lineitemSchema);

module.exports = Lineitem;

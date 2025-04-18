const { boolean } = require('joi');
const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    options: [
      {
        _id: false,
        option: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Optional",
        },
        choices: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Choice",
        },
        addPrice: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.LineItem || mongoose.model('LineItem', lineItemSchema);
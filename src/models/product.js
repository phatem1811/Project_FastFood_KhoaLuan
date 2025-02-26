const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    isSelling: {
      type: Boolean,
      default: true,
    },
    isStock: {
      type: Boolean,
      default: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    options: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Optional",
      },
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

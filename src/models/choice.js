const mongoose = require("mongoose");

const choiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    additionalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    optional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Optional", 
    },
  },
  
  {
    timestamps: true,
  }
);

const Choice = mongoose.model("Choice", choiceSchema);

module.exports = Choice;

const mongoose = require("mongoose");

const faSecretKeySchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: false,
    },
    key: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const FA_SecretKey = mongoose.model("FA_SecretKey", faSecretKeySchema);

module.exports = FA_SecretKey;

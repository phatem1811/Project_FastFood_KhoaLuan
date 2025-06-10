const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    birthdate: {
      type: Date,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    
    state: {
      type: Boolean,
      default: true,
    },
    point: {
      type: Number,
      default: 0,
    },
    role: {
      type: Number,
      required: true,
      default: 3,
    },
    showQrCode: {
      type: Boolean,
      default: true,
    },
    bills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;

const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true, trim: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", default: null },
    anonymousId: { type: String, default: null }, 
  },
  { timestamps: true } 
);

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);
module.exports = SearchHistory;

const mongoose = require("mongoose");

const optionalSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      choices: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Choice",
        },
      ],
    },
    {
      timestamps: true,
    }
  );
  
  const Optional = mongoose.model("Optional", optionalSchema);
  
  
  module.exports = Optional;
  
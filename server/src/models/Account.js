const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    contact: { type: String, trim: true },
    address: { type: String, trim: true },
    tags: { type: [String], default: [] } // optional: Investor/Customer etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", AccountSchema);

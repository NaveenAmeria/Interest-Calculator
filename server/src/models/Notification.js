const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["DUE_SOON", "OVERDUE"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", default: null },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);

const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    note: { type: String, default: "" }
  },
  { _id: false }
);

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", default: null },

    date: { type: Date, required: true }, // transaction start date
    name: { type: String, required: true, trim: true },

    principal: { type: Number, required: true },
    rateAnnual: { type: Number, required: true }, // percent per year

    durationMonths: { type: Number, required: true },
    frequency: { type: String, enum: ["MONTHLY", "YEARLY"], required: true },
    interestType: { type: String, enum: ["SIMPLE", "COMPOUND"], required: true },

    direction: { type: String, enum: ["GIVEN", "TAKEN"], required: true }, // Given/Lent or Taken/Borrowed

    modeOfPayment: { type: String, default: "" },
    notes: { type: String, default: "" },

    screenshot: {
      key: { type: String, default: "" },
      url: { type: String, default: "" }
    },

    payments: { type: [PaymentSchema], default: [] }, // partial payments log
    status: { type: String, enum: ["ACTIVE", "CLOSED"], default: "ACTIVE" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);

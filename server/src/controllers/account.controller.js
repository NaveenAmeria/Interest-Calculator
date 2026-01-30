const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const { createAccountSchema } = require("../validators/account.schema");
const { computeInterest, computeOutstanding, round2 } = require("../utils/interest");

async function createAccount(req, res, next) {
  try {
    const body = createAccountSchema.parse(req.body);
    const acc = await Account.create({ ...body, userId: req.user.id });
    return res.json(acc);
  } catch (e) {
    return next(e);
  }
}

async function listAccounts(req, res, next) {
  try {
    const accounts = await Account.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const tx = await Transaction.find({ userId: req.user.id, status: "ACTIVE" });

    const totals = new Map(); // accountId -> aggregates
    for (const t of tx) {
      const { interest, total } = computeInterest({
        principal: t.principal,
        rateAnnual: t.rateAnnual,
        durationMonths: t.durationMonths,
        frequency: t.frequency,
        interestType: t.interestType
      });
      const paymentsTotal = (t.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
      const outstanding = computeOutstanding({ totalPayable: total, paymentsTotal });

      const key = String(t.accountId || "none");
      const prev = totals.get(key) || { given: 0, taken: 0, interestRecv: 0, interestPay: 0, outstandingGiven: 0, outstandingTaken: 0 };
      if (t.direction === "GIVEN") {
        prev.given += total;
        prev.interestRecv += interest;
        prev.outstandingGiven += outstanding;
      } else {
        prev.taken += total;
        prev.interestPay += interest;
        prev.outstandingTaken += outstanding;
      }
      totals.set(key, prev);
    }

    const enriched = accounts.map(a => {
      const t = totals.get(String(a._id)) || { given: 0, taken: 0, interestRecv: 0, interestPay: 0, outstandingGiven: 0, outstandingTaken: 0 };
      return {
        ...a.toObject(),
        totals: {
          given: round2(t.given),
          taken: round2(t.taken),
          interestRecv: round2(t.interestRecv),
          interestPay: round2(t.interestPay),
          outstandingGiven: round2(t.outstandingGiven),
          outstandingTaken: round2(t.outstandingTaken)
        }
      };
    });

    return res.json(enriched);
  } catch (e) {
    return next(e);
  }
}

module.exports = { createAccount, listAccounts };

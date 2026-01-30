const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const Notification = require("../models/Notification");
const { createTransactionSchema, addPaymentSchema } = require("../validators/transaction.schema");
const { computeInterest, computeOutstanding } = require("../utils/interest");
const { makeS3 } = require("../config/s3");
const { randomKey, uploadToS3 } = require("../services/s3Upload");

function dueDate(tx) {
  const d = new Date(tx.date);
  d.setMonth(d.getMonth() + tx.durationMonths);
  return d;
}

async function createTransaction(req, res, next) {
  try {
    const body = createTransactionSchema.parse(req.body);

    if (body.accountId) {
      const ok = await Account.findOne({ _id: body.accountId, userId: req.user.id });
      if (!ok) return res.status(400).json({ message: "Invalid accountId" });
    }

    const tx = await Transaction.create({
      userId: req.user.id,
      accountId: body.accountId || null,
      date: body.date,
      name: body.name,
      principal: body.principal,
      rateAnnual: body.rateAnnual,
      durationMonths: body.durationMonths,
      frequency: body.frequency,
      interestType: body.interestType,
      direction: body.direction,
      modeOfPayment: body.modeOfPayment || "",
      notes: body.notes || ""
    });

    return res.json(tx);
  } catch (e) {
    return next(e);
  }
}

async function listTransactions(req, res, next) {
  try {
    const rows = await Transaction.find({ userId: req.user.id })
      .populate("accountId", "name")
      .sort({ date: -1 });

    const out = rows.map(t => {
      const computed = computeInterest({
        principal: t.principal,
        rateAnnual: t.rateAnnual,
        durationMonths: t.durationMonths,
        frequency: t.frequency,
        interestType: t.interestType
      });
      const paymentsTotal = (t.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
      return {
        ...t.toObject(),
        computed,
        paymentsTotal,
        outstanding: computeOutstanding({ totalPayable: computed.total, paymentsTotal }),
        dueDate: dueDate(t)
      };
    });

    return res.json(out);
  } catch (e) {
    return next(e);
  }
}

async function addPayment(req, res, next) {
  try {
    const body = addPaymentSchema.parse(req.body);
    const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    tx.payments.push({ date: body.date, amount: body.amount, note: body.note || "" });

    // auto close if fully paid (based on computed total)
    const computed = computeInterest({
      principal: tx.principal,
      rateAnnual: tx.rateAnnual,
      durationMonths: tx.durationMonths,
      frequency: tx.frequency,
      interestType: tx.interestType
    });
    const paymentsTotal = tx.payments.reduce((s, p) => s + (p.amount || 0), 0);
    const outstanding = computeOutstanding({ totalPayable: computed.total, paymentsTotal });
    if (outstanding <= 0) tx.status = "CLOSED";

    await tx.save();
    return res.json({ ok: true, txId: tx._id, status: tx.status, outstanding });
  } catch (e) {
    return next(e);
  }
}

async function uploadScreenshot(req, res, next) {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const s3 = makeS3();
    const bucket = process.env.S3_BUCKET;
    const baseUrl = process.env.S3_PUBLIC_BASE_URL;

    if (!s3 || !bucket || !baseUrl) {
      return res.status(400).json({ message: "AWS S3 is not configured in .env" });
    }

    const key = randomKey("screenshots", req.file.originalname);
    await uploadToS3({
      s3,
      bucket,
      key,
      buffer: req.file.buffer,
      contentType: req.file.mimetype
    });

    tx.screenshot = { key, url: `${baseUrl}/${key}` };
    await tx.save();

    return res.json({ ok: true, screenshot: tx.screenshot });
  } catch (e) {
    return next(e);
  }
}

async function markClosed(req, res, next) {
  try {
    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "CLOSED" },
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    return res.json(tx);
  } catch (e) {
    return next(e);
  }
}

async function generateNotifications(req, res, next) {
  try {
    // on-demand generation for current user; cron also calls globally
    const items = await buildNotificationsForUser(req.user.id);
    return res.json(items);
  } catch (e) {
    return next(e);
  }
}

async function listNotifications(req, res, next) {
  try {
    const rows = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100);
    return res.json(rows);
  } catch (e) {
    return next(e);
  }
}

async function markNotificationRead(req, res, next) {
  try {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    if (!n) return res.status(404).json({ message: "Notification not found" });
    return res.json(n);
  } catch (e) {
    return next(e);
  }
}

async function buildNotificationsForUser(userId) {
  const now = new Date();
  const txs = await Transaction.find({ userId, status: "ACTIVE" });

  const created = [];
  for (const tx of txs) {
    const due = dueDate(tx);
    const diffDays = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let type = null;
    let title = null;
    let message = null;

    if (diffDays < 0) {
      type = "OVERDUE";
      title = "Payment overdue";
      message = `${tx.name} payment overdue by ${Math.abs(diffDays)} day(s)`;
    } else if (diffDays <= 3) {
      type = "DUE_SOON";
      title = "Payment due soon";
      message = `${tx.name} payment due in ${diffDays} day(s)`;
    }

    if (!type) continue;

    // de-dupe: create one per day per tx per type
    const dayKey = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const exists = await Notification.findOne({
      userId,
      relatedTransactionId: tx._id,
      type,
      createdAt: { $gte: dayKey }
    });

    if (exists) continue;

    const n = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedTransactionId: tx._id
    });
    created.push(n);
  }

  return created;
}

module.exports = {
  createTransaction,
  listTransactions,
  addPayment,
  uploadScreenshot,
  markClosed,
  generateNotifications,
  listNotifications,
  markNotificationRead,
  buildNotificationsForUser
};

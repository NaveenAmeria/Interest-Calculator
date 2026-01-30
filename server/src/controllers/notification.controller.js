const Transaction = require("../models/Transaction");

function daysDiff(a, b) {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

async function listNotifications(req, res) {
  const tx = await Transaction.find({ userId: req.user.id, status: "ACTIVE" }).sort({ date: -1 });

  const now = new Date();
  const notifications = [];

  for (const t of tx) {
    const due = new Date(t.date);
    due.setMonth(due.getMonth() + t.durationMonths);

    const d = daysDiff(now, due);

    if (d < 0) {
      notifications.push({
        id: String(t._id),
        type: "OVERDUE",
        title: "Payment overdue",
        message: `${t.name} payment overdue by ${Math.abs(d)} days`,
        createdAt: now
      });
    } else if (d <= 3) {
      notifications.push({
        id: String(t._id),
        type: "DUE_SOON",
        title: "Payment due soon",
        message: `${t.name} payment due in ${d} day(s)`,
        createdAt: now
      });
    }
  }

  return res.json(notifications);
}

module.exports = { listNotifications };

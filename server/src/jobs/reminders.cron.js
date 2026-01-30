const cron = require("node-cron");
const User = require("../models/User");
const { buildNotificationsForUser } = require("../controllers/transaction.controller");

function startReminderJobs() {
  const tz = process.env.APP_TZ || "Asia/Kolkata";

  // Every day at 09:00 local time
  cron.schedule(
    "0 9 * * *",
    async () => {
      try {
        console.log("🔔 Cron: generating notifications for all users");
        const users = await User.find({}, { _id: 1 });
        for (const u of users) {
          await buildNotificationsForUser(u._id);
        }
      } catch (e) {
        console.error("Cron error:", e);
      }
    },
    { timezone: tz }
  );
}

module.exports = { startReminderJobs };

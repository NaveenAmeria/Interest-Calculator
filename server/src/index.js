require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { connectDB } = require("./config/db");
const { startReminderJobs } = require("./jobs/reminders.cron");
const { notFound, errorHandler } = require("./middleware/error");

const authRoutes = require("./routes/auth.routes");
const accountRoutes = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.routes");
const notificationRoutes = require("./routes/notification.routes");

const app = express();

app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, limit: 200 })); // basic protection

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    startReminderJobs();
    app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Statsup Error:", err);
    process.exit(1);
  }
})();

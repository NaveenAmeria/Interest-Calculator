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

// CORS - support both local and production
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// Initialize database connection (for Vercel, this happens on cold start)
let isDbConnected = false;
const initDB = async () => {
  if (!isDbConnected) {
    await connectDB(process.env.MONGO_URI);
    isDbConnected = true;
    console.log("✅ Database connected");
  }
};

// Health check - initialize DB if needed
app.get("/health", async (req, res) => {
  try {
    await initDB();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Routes - initialize DB before handling
app.use(async (req, res, next) => {
  try {
    await initDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

// For Vercel serverless - export the app
module.exports = app;

// For local development - start the server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  (async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      startReminderJobs();
      app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));
    } catch (err) {
      console.error("❌ Startup Error:", err);
      process.exit(1);
    }
  })();
}


const router = require("express").Router();
const multer = require("multer");
const { auth } = require("../middleware/auth");
const {
  createTransaction,
  listTransactions,
  addPayment,
  uploadScreenshot,
  markClosed
} = require("../controllers/transaction.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.get("/", auth, listTransactions);
router.post("/", auth, createTransaction);

router.post("/:id/payments", auth, addPayment);
router.post("/:id/screenshot", auth, upload.single("file"), uploadScreenshot);
router.patch("/:id/close", auth, markClosed);

module.exports = router;

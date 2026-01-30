const router = require("express").Router();
const { auth } = require("../middleware/auth");
const {
  generateNotifications,
  listNotifications,
  markNotificationRead
} = require("../controllers/transaction.controller");

router.post("/generate", auth, generateNotifications);
router.get("/", auth, listNotifications);
router.patch("/:id/read", auth, markNotificationRead);

module.exports = router;

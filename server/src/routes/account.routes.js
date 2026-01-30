const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { createAccount, listAccounts } = require("../controllers/account.controller");

router.get("/", auth, listAccounts);
router.post("/", auth, createAccount);

module.exports = router;

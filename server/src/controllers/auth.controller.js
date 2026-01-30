const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerSchema, loginSchema } = require("../validators/auth.schema");

async function register(req, res, next) {
  try {
    const body = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: body.email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await User.create({ name: body.name, email: body.email, passwordHash });

    return res.json({ id: user._id, name: user.name, email: user.email });
  } catch (e) {
    return next(e);
  }
}

async function login(req, res, next) {
  try {
    const body = loginSchema.parse(req.body);
    const user = await User.findOne({ email: body.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    return next(e);
  }
}

module.exports = { register, login };

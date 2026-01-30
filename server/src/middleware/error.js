function notFound(req, res) {
  return res.status(404).json({ message: "Route not found" });
}

function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  return res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };

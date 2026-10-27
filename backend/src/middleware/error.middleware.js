export function notFound(req, res, _next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(", ") });
  }
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid identifier." });
  if (err.code === 11000) return res.status(409).json({ message: "That value is already in use." });
  res.status(err.status || 500).json({ message: err.message || "Something went wrong." });
}

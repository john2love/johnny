// middlewares/error.middleware.js

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error("🔥 Error:", err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;
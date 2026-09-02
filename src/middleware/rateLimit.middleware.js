const rateLimit = require("express-rate-limit");

// Жалпы API лимиті
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  limit: 300,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    error: "Too many requests, please try again later",
  },
});

// Login/Register үшін қаттырақ лимит
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  limit: 20,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    error: "Too many authentication attempts, please try again later",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const { apiLimiter } = require("./middleware/rateLimit.middleware");

const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/error.middleware");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const chatRoutes = require("./modules/chats/chat.routes");
const messageRoutes = require("./modules/messages/message.routes");
const notificationRoutes = require("./modules/notifications/notification.routes");

const app = express();

// Express туралы артық ақпаратты жасыру
app.disable("x-powered-by");

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Postman, PowerShell, curl сияқты Origin жібермейтін сұраныстарға рұқсат
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  }),
);

// Body parser
app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Static uploaded files
// Static uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Chat API is running",
    timestamp: new Date().toISOString(),
  });
});

// General API rate limiter
app.use("/api", apiLimiter);

// API routes
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

// Chat routes
app.use("/api/chats", chatRoutes);

// Message routes те /api/chats арқылы жұмыс істейді
app.use("/api/chats", messageRoutes);

app.use("/api/notifications", notificationRoutes);

// Unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;

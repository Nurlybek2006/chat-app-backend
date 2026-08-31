require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const chatRoutes = require("./modules/chats/chat.routes");
const messageRoutes = require("./modules/messages/message.routes");
const notificationRoutes = require("./modules/notifications/notification.routes");

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/chats", messageRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/notifications", notificationRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Chat API is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;

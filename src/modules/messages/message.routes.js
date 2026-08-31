const express = require("express");

const messageController = require("./message.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

const router = express.Router();

router.post("/:chatId/messages", authMiddleware, (req, res) => {
  messageController.sendMessage(req, res);
});

router.get("/:chatId/messages", authMiddleware, (req, res) => {
  messageController.getMessages(req, res);
});

router.patch("/messages/:messageId", authMiddleware, (req, res) => {
  messageController.updateMessage(req, res);
});

router.delete("/messages/:messageId", authMiddleware, (req, res) => {
  messageController.deleteMessage(req, res);
});

router.patch("/messages/:messageId/read", authMiddleware, (req, res) => {
  messageController.markAsRead(req, res);
});

router.patch("/:chatId/read", authMiddleware, (req, res) => {
  messageController.markChatAsRead(req, res);
});

router.post(
  "/:chatId/messages/file",
  authMiddleware,
  upload.single("file"),
  (req, res) => {
    messageController.sendFile(req, res);
  },
);

module.exports = router;

const express = require('express');

const messageController = require('./message.controller');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/:chatId/messages', authMiddleware, (req, res) => {
  messageController.sendMessage(req, res);
});

router.get('/:chatId/messages', authMiddleware, (req, res) => {
  messageController.getMessages(req, res);
});

router.patch(
  '/messages/:messageId',
  authMiddleware,
  (req, res) => {
    messageController.updateMessage(req, res);
  }
);

router.delete(
  '/messages/:messageId',
  authMiddleware,
  (req, res) => {
    messageController.deleteMessage(req, res);
  }
);

module.exports = router;
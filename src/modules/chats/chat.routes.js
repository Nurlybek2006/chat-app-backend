const express = require('express');

const chatController = require('./chat.controller');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/private', authMiddleware, (req, res) => {
  chatController.createPrivateChat(req, res);
});

router.post('/group', authMiddleware, (req, res) => {
  chatController.createGroupChat(req, res);
});

router.get('/', authMiddleware, (req, res) => {
  chatController.getChats(req, res);
});

router.get('/:chatId', authMiddleware, (req, res) => {
  chatController.getChatById(req, res);
});

module.exports = router;
const express = require('express');

const userController = require('./user.controller');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/me', authMiddleware, (req, res) => {
  userController.getProfile(req, res);
});

router.patch('/me', authMiddleware, (req, res) => {
  userController.updateProfile(req, res);
});

router.get('/search', authMiddleware, (req, res) => {
  userController.searchUsers(req, res);
});

module.exports = router;
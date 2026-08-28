const express = require('express');
const authController = require('./auth.controller');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/register', (req, res) => {
  authController.register(req, res);
});

router.post('/login', (req, res) => {
  authController.login(req, res);
});

router.get('/me', authMiddleware, (req, res) => {
  authController.me(req, res);
});

module.exports = router;
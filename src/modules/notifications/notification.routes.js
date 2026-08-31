const express = require('express');

const authMiddleware =
  require('../../middleware/auth.middleware');

const notificationController =
  require('./notification.controller');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  (req, res) => {
    notificationController
      .getNotifications(req, res);
  }
);

router.get(
  '/unread-count',
  authMiddleware,
  (req, res) => {
    notificationController
      .getUnreadCount(req, res);
  }
);

router.patch(
  '/read-all',
  authMiddleware,
  (req, res) => {
    notificationController
      .markAllAsRead(req, res);
  }
);

router.patch(
  '/:notificationId/read',
  authMiddleware,
  (req, res) => {
    notificationController
      .markAsRead(req, res);
  }
);

router.delete(
  '/:notificationId',
  authMiddleware,
  (req, res) => {
    notificationController
      .deleteNotification(req, res);
  }
);

module.exports = router;
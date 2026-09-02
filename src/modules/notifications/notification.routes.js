const express = require("express");

const authMiddleware = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validation.middleware");

const notificationController = require("./notification.controller");

const { notificationIdValidation } = require("./notifications.validation");

const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get current user's notifications
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Notification"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get("/", authMiddleware, (req, res) => {
  notificationController.getNotifications(req, res);
});

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count
 */
router.get("/unread-count", authMiddleware, (req, res) => {
  notificationController.getUnreadCount(req, res);
});

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.patch("/read-all", authMiddleware, (req, res) => {
  notificationController.markAllAsRead(req, res);
});

/**
 * @swagger
 * /api/notifications/{notificationId}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       400:
 *         description: Validation error
 */
router.patch(
  "/:notificationId/read",
  authMiddleware,
  notificationIdValidation,
  validate,
  (req, res) => {
    notificationController.markAsRead(req, res);
  },
);

/**
 * @swagger
 * /api/notifications/{notificationId}:
 *   delete:
 *     summary: Delete notification
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notification deleted
 *       400:
 *         description: Validation error
 */
router.delete(
  "/:notificationId",
  authMiddleware,
  notificationIdValidation,
  validate,
  (req, res) => {
    notificationController.deleteNotification(req, res);
  },
);

module.exports = router;

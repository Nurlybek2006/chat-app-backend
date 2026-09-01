const express = require("express");

const messageController = require("./message.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/chats/{chatId}/messages:
 *   post:
 *     summary: Send text message
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Hello Backend Team!
 *               replyToId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Message sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   $ref: "#/components/schemas/Message"
 *       400:
 *         description: Message send error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @swagger
 * /api/chats/{chatId}/messages:
 *   get:
 *     summary: Get message history
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search messages by content
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - TEXT
 *             - IMAGE
 *             - FILE
 *       - in: query
 *         name: senderId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Message history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Message"
 *                 pagination:
 *                   $ref: "#/components/schemas/Pagination"
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @swagger
 * /api/chats/messages/{messageId}:
 *   patch:
 *     summary: Edit message
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Edited message
 *     responses:
 *       200:
 *         description: Message updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   $ref: "#/components/schemas/Message"
 *       400:
 *         description: Message update error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @swagger
 * /api/chats/messages/{messageId}:
 *   delete:
 *     summary: Delete message
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Message deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message deleted
 *       400:
 *         description: Delete error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @swagger
 * /api/chats/messages/{messageId}/read:
 *   patch:
 *     summary: Mark one message as read
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Message marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messageId:
 *                   type: string
 *                   format: uuid
 *                 readBy:
 *                   type: string
 *                   format: uuid
 *                 readAt:
 *                   type: string
 *                   format: date-time
 *                 alreadyRead:
 *                   type: boolean
 *       400:
 *         description: Read operation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @swagger
 * /api/chats/{chatId}/read:
 *   patch:
 *     summary: Mark all chat messages as read
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Messages marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Messages marked as read
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 messageIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uuid
 *                 readAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       400:
 *         description: Read operation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @swagger
 * /api/chats/{chatId}/messages/file:
 *   post:
 *     summary: Send file or image
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               content:
 *                 type: string
 *                 example: Test file
 *               replyToId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *     responses:
 *       201:
 *         description: File message sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   $ref: "#/components/schemas/Message"
 *       400:
 *         description: File upload error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

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

const express = require("express");

const messageController = require("./message.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");
const validate = require("../../middleware/validation.middleware");

const {
  sendMessageValidation,
  getMessagesValidation,
  updateMessageValidation,
  messageIdValidation,
  chatIdValidation,
  sendFileValidation,
} = require("./messages.validation");

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
 *         description: Message send or validation error
 */
router.post(
  "/:chatId/messages",
  authMiddleware,
  sendMessageValidation,
  validate,
  (req, res) => {
    messageController.sendMessage(req, res);
  },
);

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
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied
 */
router.get(
  "/:chatId/messages",
  authMiddleware,
  getMessagesValidation,
  validate,
  (req, res) => {
    messageController.getMessages(req, res);
  },
);

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
 *       400:
 *         description: Message update or validation error
 */
router.patch(
  "/messages/:messageId",
  authMiddleware,
  updateMessageValidation,
  validate,
  (req, res) => {
    messageController.updateMessage(req, res);
  },
);

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
 *       400:
 *         description: Delete or validation error
 */
router.delete(
  "/messages/:messageId",
  authMiddleware,
  messageIdValidation,
  validate,
  (req, res) => {
    messageController.deleteMessage(req, res);
  },
);

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
 *       400:
 *         description: Read operation or validation error
 */
router.patch(
  "/messages/:messageId/read",
  authMiddleware,
  messageIdValidation,
  validate,
  (req, res) => {
    messageController.markAsRead(req, res);
  },
);

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
 *       400:
 *         description: Read operation or validation error
 */
router.patch(
  "/:chatId/read",
  authMiddleware,
  chatIdValidation,
  validate,
  (req, res) => {
    messageController.markChatAsRead(req, res);
  },
);

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
 *       400:
 *         description: File upload or validation error
 */
router.post(
  "/:chatId/messages/file",
  authMiddleware,

  // Multer алдымен multipart/form-data-ны оқуы керек.
  upload.single("file"),

  // Осыдан кейін req.file және req.body дайын болады.
  sendFileValidation,
  validate,

  (req, res) => {
    messageController.sendFile(req, res);
  },
);

module.exports = router;

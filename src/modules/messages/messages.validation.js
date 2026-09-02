const { body, param, query } = require("express-validator");

// POST /api/chats/:chatId/messages
const sendMessageValidation = [
  param("chatId").isUUID().withMessage("chatId must be a valid UUID"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("content is required")
    .isLength({ max: 5000 })
    .withMessage("content must not exceed 5000 characters"),

  body("replyToId")
    .optional({ nullable: true, checkFalsy: true })
    .isUUID()
    .withMessage("replyToId must be a valid UUID"),
];

// GET /api/chats/:chatId/messages
const getMessagesValidation = [
  param("chatId").isUUID().withMessage("chatId must be a valid UUID"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be an integer greater than or equal to 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("search must not exceed 100 characters"),

  query("type")
    .optional()
    .isIn(["TEXT", "IMAGE", "FILE"])
    .withMessage("type must be TEXT, IMAGE or FILE"),

  query("senderId")
    .optional()
    .isUUID()
    .withMessage("senderId must be a valid UUID"),
];

// PATCH /api/chats/messages/:messageId
const updateMessageValidation = [
  param("messageId").isUUID().withMessage("messageId must be a valid UUID"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("content is required")
    .isLength({ max: 5000 })
    .withMessage("content must not exceed 5000 characters"),
];

// DELETE /api/chats/messages/:messageId
// PATCH  /api/chats/messages/:messageId/read
const messageIdValidation = [
  param("messageId").isUUID().withMessage("messageId must be a valid UUID"),
];

// PATCH /api/chats/:chatId/read
const chatIdValidation = [
  param("chatId").isUUID().withMessage("chatId must be a valid UUID"),
];

// POST /api/chats/:chatId/messages/file
const sendFileValidation = [
  param("chatId").isUUID().withMessage("chatId must be a valid UUID"),

  body("content")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage("content must not exceed 5000 characters"),

  body("replyToId")
    .optional({ nullable: true, checkFalsy: true })
    .isUUID()
    .withMessage("replyToId must be a valid UUID"),

  body("file").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("file is required");
    }

    return true;
  }),
];

module.exports = {
  sendMessageValidation,
  getMessagesValidation,
  updateMessageValidation,
  messageIdValidation,
  chatIdValidation,
  sendFileValidation,
};

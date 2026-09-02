const { body, param } = require("express-validator");

const createPrivateChatValidation = [
  body("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isUUID()
    .withMessage("userId must be a valid UUID"),
];

const createGroupChatValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("name must be between 2 and 100 characters"),

  body("memberIds")
    .isArray({ min: 1 })
    .withMessage("memberIds must be a non-empty array"),

  body("memberIds.*")
    .isUUID()
    .withMessage("Each memberIds value must be a valid UUID"),
];

const chatIdValidation = [
  param("chatId")
    .isUUID()
    .withMessage("chatId must be a valid UUID"),
];

const updateChatValidation = [
  param("chatId")
    .isUUID()
    .withMessage("chatId must be a valid UUID"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("name must be between 2 and 100 characters"),
];

const addMemberValidation = [
  param("chatId")
    .isUUID()
    .withMessage("chatId must be a valid UUID"),

  body("memberId")
    .notEmpty()
    .withMessage("memberId is required")
    .isUUID()
    .withMessage("memberId must be a valid UUID"),
];

const memberValidation = [
  param("chatId")
    .isUUID()
    .withMessage("chatId must be a valid UUID"),

  param("memberId")
    .isUUID()
    .withMessage("memberId must be a valid UUID"),
];

const updateMemberRoleValidation = [
  param("chatId")
    .isUUID()
    .withMessage("chatId must be a valid UUID"),

  param("memberId")
    .isUUID()
    .withMessage("memberId must be a valid UUID"),

  body("role")
    .notEmpty()
    .withMessage("role is required")
    .isIn(["ADMIN", "MEMBER"])
    .withMessage("role must be ADMIN or MEMBER"),
];

module.exports = {
  createPrivateChatValidation,
  createGroupChatValidation,
  chatIdValidation,
  updateChatValidation,
  addMemberValidation,
  memberValidation,
  updateMemberRoleValidation,
};
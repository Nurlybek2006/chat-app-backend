const { body, query } = require("express-validator");

const updateMeValidation = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),

  body("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string"),
];

const searchUsersValidation = [
  query("q")
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Search query must be between 2 and 50 characters"),
];

module.exports = {
  updateMeValidation,
  searchUsersValidation,
};
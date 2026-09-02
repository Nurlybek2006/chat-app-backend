const { param } = require("express-validator");

const notificationIdValidation = [
  param("notificationId")
    .isUUID()
    .withMessage("notificationId must be a valid UUID"),
];

module.exports = {
  notificationIdValidation,
};
const express = require("express");
const authController = require("./auth.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validation.middleware");
const { authLimiter } = require("../../middleware/rateLimit.middleware");

const { registerValidation, loginValidation } = require("./auth.validation");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@test.com
 *               username:
 *                 type: string
 *                 example: user123
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Registration error
 */
router.post(
  "/register",
  authLimiter,
  registerValidation,
  validate,
  authController.register,
);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: nurlybek@test.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Login failed
 */
router.post("/login", authLimiter, loginValidation, validate, authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, authController.me);

module.exports = router;

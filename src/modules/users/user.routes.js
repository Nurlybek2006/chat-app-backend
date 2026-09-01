const express = require("express");

const userController = require("./user.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Update current user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: nurlibek06
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.png
 *     responses:
 *       200:
 *         description: User profile updated
 *       400:
 *         description: Update error
 */

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example: bekzat
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/me", authMiddleware, (req, res) => {
  userController.getProfile(req, res);
});

router.patch("/me", authMiddleware, (req, res) => {
  userController.updateProfile(req, res);
});

router.get("/search", authMiddleware, (req, res) => {
  userController.searchUsers(req, res);
});

module.exports = router;

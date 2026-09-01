const express = require("express");

const chatController = require("./chat.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/chats/private:
 *   post:
 *     summary: Create or get private chat
 *     tags:
 *       - Chats
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: 4623e8d0-342b-4d6b-ad72-191e5c0dd429
 *     responses:
 *       201:
 *         description: Private chat created
 */

/**
 * @swagger
 * /api/chats/group:
 *   post:
 *     summary: Create group chat
 *     tags:
 *       - Chats
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - memberIds
 *             properties:
 *               name:
 *                 type: string
 *                 example: Backend Team
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example:
 *                   - 4623e8d0-342b-4d6b-ad72-191e5c0dd429
 *                   - 02522650-6fee-4ed9-9497-3f92fa09863b
 *     responses:
 *       201:
 *         description: Group chat created
 */

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Get current user's chats
 *     tags:
 *       - Chats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chats:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Chat"
 */

/**
 * @swagger
 * /api/chats/{chatId}:
 *   get:
 *     summary: Get chat by ID
 *     tags:
 *       - Chats
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
 *         description: Chat details
 */

/**
 * @swagger
 * /api/chats/{chatId}:
 *   patch:
 *     summary: Update group chat
 *     tags:
 *       - Chats
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Backend Developers
 *     responses:
 *       200:
 *         description: Group updated
 */

/**
 * @swagger
 * /api/chats/{chatId}/members:
 *   get:
 *     summary: Get chat members
 *     tags:
 *       - Chats
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
 *         description: Chat members
 */

/**
 * @swagger
 * /api/chats/{chatId}/members:
 *   post:
 *     summary: Add member to group
 *     tags:
 *       - Chats
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
 *               - memberId
 *             properties:
 *               memberId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Member added
 */

/**
 * @swagger
 * /api/chats/{chatId}/members/{memberId}:
 *   delete:
 *     summary: Remove member from group
 *     tags:
 *       - Chats
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Member removed
 */

/**
 * @swagger
 * /api/chats/{chatId}/members/{memberId}/role:
 *   patch:
 *     summary: Update chat member role
 *     tags:
 *       - Chats
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: memberId
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - MEMBER
 *                 example: MEMBER
 *     responses:
 *       200:
 *         description: Member role updated
 */
router.post("/private", authMiddleware, (req, res) => {
  chatController.createPrivateChat(req, res);
});

router.post("/group", authMiddleware, (req, res) => {
  chatController.createGroupChat(req, res);
});

router.get("/", authMiddleware, (req, res) => {
  chatController.getChats(req, res);
});

router.get("/:chatId", authMiddleware, (req, res) => {
  chatController.getChatById(req, res);
});

router.post("/:chatId/members", authMiddleware, (req, res) => {
  chatController.addMember(req, res);
});

router.delete("/:chatId/members/:memberId", authMiddleware, (req, res) => {
  chatController.removeMember(req, res);
});

router.patch("/:chatId/members/:memberId/role", authMiddleware, (req, res) => {
  chatController.updateMemberRole(req, res);
});

router.patch("/:chatId", authMiddleware, (req, res) => {
  chatController.updateGroup(req, res);
});

router.get("/:chatId/members", authMiddleware, (req, res) => {
  chatController.getMembers(req, res);
});

module.exports = router;

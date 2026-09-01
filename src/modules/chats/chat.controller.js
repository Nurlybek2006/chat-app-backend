const chatService = require("./chat.service");

class ChatController {
  async createPrivateChat(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: "userId is required",
        });
      }

      const chat = await chatService.createPrivateChat(req.user.userId, userId);

      return res.status(201).json({
        chat,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async createGroupChat(req, res) {
    try {
      const chat = await chatService.createGroupChat(req.user.userId, req.body);

      return res.status(201).json({
        chat,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async getChats(req, res) {
    try {
      const chats = await chatService.getChats(req.user.userId);

      return res.status(200).json({
        chats,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  async getChatById(req, res) {
    try {
      const { chatId } = req.params;

      const chat = await chatService.getChatById(chatId, req.user.userId);

      return res.status(200).json({
        chat,
      });
    } catch (error) {
      return res.status(403).json({
        error: error.message,
      });
    }
  }

  async addMember(req, res) {
    try {
      const { chatId } = req.params;
      const { memberId } = req.body;

      if (!memberId) {
        return res.status(400).json({
          error: "memberId is required",
        });
      }

      const member = await chatService.addMember(
        req.user.userId,
        chatId,
        memberId,
      );

      return res.status(201).json({
        member,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async removeMember(req, res) {
    try {
      const { chatId, memberId } = req.params;

      const result = await chatService.removeMember(
        req.user.userId,
        chatId,
        memberId,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async updateMemberRole(req, res) {
    try {
      const { chatId, memberId } = req.params;

      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          error: "role is required",
        });
      }

      const member = await chatService.updateMemberRole(
        req.user.userId,
        chatId,
        memberId,
        role,
      );

      return res.status(200).json({
        member,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async updateGroup(req, res) {
    try {
      const { chatId } = req.params;
      const { name } = req.body;

      const chat = await chatService.updateGroup(req.user.userId, chatId, {
        name,
      });

      return res.status(200).json({
        chat,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async getMembers(req, res) {
    try {
      const { chatId } = req.params;

      const members = await chatService.getMembers(req.user.userId, chatId);

      return res.status(200).json({
        members,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports = new ChatController();

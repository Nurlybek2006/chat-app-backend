const chatService = require('./chat.service');

class ChatController {
  async createPrivateChat(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: 'userId is required',
        });
      }

      const chat = await chatService.createPrivateChat(
        req.user.userId,
        userId
      );

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
      const chat = await chatService.createGroupChat(
        req.user.userId,
        req.body
      );

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
      const chats = await chatService.getChats(
        req.user.userId
      );

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

      const chat = await chatService.getChatById(
        chatId,
        req.user.userId
      );

      return res.status(200).json({
        chat,
      });
    } catch (error) {
      return res.status(403).json({
        error: error.message,
      });
    }
  }
}

module.exports = new ChatController();
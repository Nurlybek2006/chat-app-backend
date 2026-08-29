const messageService = require("./message.service");
const { getIO } = require("../../config/socket");

class MessageController {
  async sendMessage(req, res) {
    try {
      const { chatId } = req.params;

      const message = await messageService.sendMessage(
        req.user.userId,
        chatId,
        req.body,
      );

      const io = getIO();

      io.to(`chat:${chatId}`).emit("new-message", {
        message,
      });

      return res.status(201).json({
        message,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async getMessages(req, res) {
    try {
      const { chatId } = req.params;
      const { page, limit } = req.query;

      const result = await messageService.getMessages(
        req.user.userId,
        chatId,
        page,
        limit,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(403).json({
        error: error.message,
      });
    }
  }

  async updateMessage(req, res) {
    try {
      const { messageId } = req.params;
      const { content } = req.body;

      const message = await messageService.updateMessage(
        req.user.userId,
        messageId,
        content,
      );

      return res.status(200).json({
        message,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;

      const result = await messageService.deleteMessage(
        req.user.userId,
        messageId,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports = new MessageController();

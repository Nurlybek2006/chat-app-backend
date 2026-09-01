const messageService = require("./message.service");
const { getIO } = require("../../config/socket");
const notificationService = require("../notifications/notification.service");

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

      const notifications =
        await notificationService.createMessageNotifications({
          chatId,
          senderId: req.user.userId,
          message,
        });

      notifications.forEach((notification) => {
        io.to(`user:${notification.userId}`).emit("new-notification", {
          notification,
        });
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

      const { page, limit, search, type, senderId } = req.query;

      const result = await messageService.getMessages(
        req.user.userId,
        chatId,
        page,
        limit,
        search,
        type,
        senderId,
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

  async markAsRead(req, res) {
    try {
      const { messageId } = req.params;

      const result = await messageService.markAsRead(
        req.user.userId,
        messageId,
      );

      if (!result.alreadyRead) {
        const io = getIO();

        io.to(`user:${result.message.senderId}`).emit("message-read", {
          messageId: result.message.id,
          chatId: result.message.chatId,
          readBy: req.user.userId,
          readAt: result.read.readAt,
        });
      }

      return res.status(200).json({
        messageId: result.message.id,
        readBy: req.user.userId,
        readAt: result.read.readAt,
        alreadyRead: result.alreadyRead,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async markChatAsRead(req, res) {
    try {
      const { chatId } = req.params;
      const userId = req.user.userId;

      const result = await messageService.markChatAsRead(userId, chatId);

      if (result.count > 0) {
        const io = getIO();

        result.senderIds.forEach((senderId) => {
          io.to(`user:${senderId}`).emit("messages-read", {
            chatId,
            messageIds: result.messageIds,
            readBy: userId,
            readAt: result.readAt,
          });
        });
      }

      return res.status(200).json({
        message: "Messages marked as read",
        count: result.count,
        messageIds: result.messageIds,
        readAt: result.readAt,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async sendFile(req, res) {
    try {
      const { chatId } = req.params;

      if (!req.file) {
        return res.status(400).json({
          error: "File is required",
        });
      }

      const message = await messageService.sendFileMessage(
        req.user.userId,
        chatId,
        req.file,
        req.body,
      );

      const io = getIO();

      io.to(`chat:${chatId}`).emit("new-message", {
        message,
      });

      const notifications =
        await notificationService.createMessageNotifications({
          chatId,
          senderId: req.user.userId,
          message,
        });

      notifications.forEach((notification) => {
        io.to(`user:${notification.userId}`).emit("new-notification", {
          notification,
        });
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
}

module.exports = new MessageController();

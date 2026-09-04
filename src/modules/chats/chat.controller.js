const chatService = require("./chat.service");
const { getIO } = require("../../config/socket");

class ChatController {
  // --------------------------------
  // Socket helpers
  // --------------------------------

  emitChatAdded(userIds, chatId) {
    try {
      const io = getIO();

      const uniqueUserIds = [...new Set(userIds)];

      uniqueUserIds.forEach((userId) => {
        if (!userId) {
          return;
        }

        io.to(`user:${userId}`).emit("chat-added", {
          chatId,
        });
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.error("chat-added socket error:", error.message);
      }
    }
  }

  emitChatUpdated(userIds, chatId) {
    try {
      const io = getIO();

      const uniqueUserIds = [...new Set(userIds)];

      uniqueUserIds.forEach((userId) => {
        if (!userId) {
          return;
        }

        io.to(`user:${userId}`).emit("chat-updated", {
          chatId,
        });
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.error("chat-updated socket error:", error.message);
      }
    }
  }

  emitChatRemoved(userId, chatId) {
    try {
      const io = getIO();

      if (!userId) {
        return;
      }

      io.to(`user:${userId}`).emit("chat-removed", {
        chatId,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.error("chat-removed socket error:", error.message);
      }
    }
  }

  emitMemberRoleUpdated(userIds, chatId, memberId, role) {
    try {
      const io = getIO();

      const uniqueUserIds = [...new Set(userIds)];

      uniqueUserIds.forEach((userId) => {
        if (!userId) {
          return;
        }

        io.to(`user:${userId}`).emit("member-role-updated", {
          chatId,
          memberId,
          role,
        });
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.error("member-role-updated socket error:", error.message);
      }
    }
  }

  // --------------------------------
  // Create private chat
  // --------------------------------

  async createPrivateChat(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: "userId is required",
        });
      }

      const currentUserId = req.user.userId;

      const chat = await chatService.createPrivateChat(currentUserId, userId);

      this.emitChatAdded([currentUserId, userId], chat.id);

      return res.status(201).json({
        chat,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  // --------------------------------
  // Create group chat
  // --------------------------------

  async createGroupChat(req, res) {
    try {
      const currentUserId = req.user.userId;

      const chat = await chatService.createGroupChat(currentUserId, req.body);

      const memberIds = chat.members?.map((member) => member.userId) || [];

      this.emitChatAdded(memberIds, chat.id);

      return res.status(201).json({
        chat,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  // --------------------------------
  // Get chats
  // --------------------------------

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

  // --------------------------------
  // Get chat by ID
  // --------------------------------

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

  // --------------------------------
  // Add group member
  // --------------------------------

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

      this.emitChatAdded([memberId], chatId);

      // Қалған member-лердің chat data-сын да жаңартамыз
      const members = await chatService.getMembers(req.user.userId, chatId);

      const memberIds = members.map((item) => item.userId);

      this.emitChatUpdated(memberIds, chatId);

      return res.status(201).json({
        member,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  // --------------------------------
  // Remove member
  // --------------------------------

  async removeMember(req, res) {
    try {
      const { chatId, memberId } = req.params;

      const result = await chatService.removeMember(
        req.user.userId,
        chatId,
        memberId,
      );

      // Шығарылған user-дан chat жоғалады
      this.emitChatRemoved(memberId, chatId);

      // Қалған user-ларға members list жаңарғанын айтамыз
      const members = await chatService.getMembers(req.user.userId, chatId);

      const memberIds = members.map((member) => member.userId);

      this.emitChatUpdated(memberIds, chatId);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  // --------------------------------
  // Update member role
  // --------------------------------

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

      const members = await chatService.getMembers(req.user.userId, chatId);

      const memberIds = members.map((item) => item.userId);

      this.emitMemberRoleUpdated(memberIds, chatId, memberId, role);

      return res.status(200).json({
        member,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  // --------------------------------
  // Update group
  // --------------------------------

  async updateGroup(req, res) {
    try {
      const { chatId } = req.params;
      const { name } = req.body;

      const chat = await chatService.updateGroup(req.user.userId, chatId, {
        name,
      });

      const members = await chatService.getMembers(req.user.userId, chatId);

      const memberIds = members.map((member) => member.userId);

      this.emitChatUpdated(memberIds, chatId);

      return res.status(200).json({
        chat,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  // --------------------------------
  // Get members
  // --------------------------------

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

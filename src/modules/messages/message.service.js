const prisma = require("../../config/prisma");

class MessageService {
  async sendMessage(userId, chatId, data) {
    const { content, replyToId } = data;

    if (!content || content.trim().length === 0) {
      throw new Error("Message content is required");
    }

    const membership = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    if (!membership) {
      throw new Error("You are not a member of this chat");
    }

    if (replyToId) {
      const replyMessage = await prisma.message.findUnique({
        where: {
          id: replyToId,
        },
      });

      if (!replyMessage) {
        throw new Error("Reply message not found");
      }

      if (replyMessage.chatId !== chatId) {
        throw new Error("Reply message belongs to another chat");
      }
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: userId,
        chatId,
        replyToId: replyToId || null,
      },

      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },

        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return message;
  }

  async getMessages(userId, chatId, page = 1, limit = 20) {
    const membership = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    if (!membership) {
      throw new Error("You are not a member of this chat");
    }

    page = Math.max(Number(page) || 1, 1);
    limit = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          chatId,
        },

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: limit,

        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },

          replyTo: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          },
        },
      }),

      prisma.message.count({
        where: {
          chatId,
        },
      }),
    ]);

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateMessage(userId, messageId, content) {
    if (!content || content.trim().length === 0) {
      throw new Error("Message content is required");
    }

    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    if (message.senderId !== userId) {
      throw new Error("You can edit only your own messages");
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },

      data: {
        content: content.trim(),
      },

      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },

        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return updatedMessage;
  }

  async deleteMessage(userId, messageId) {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    if (message.senderId !== userId) {
      throw new Error("You can delete only your own messages");
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    return {
      message: "Message deleted successfully",
    };
  }
}

module.exports = new MessageService();

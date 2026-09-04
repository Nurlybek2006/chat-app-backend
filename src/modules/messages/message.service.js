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

  async getMessages(
    userId,
    chatId,
    page = 1,
    limit = 20,
    search,
    type,
    senderId,
  ) {
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

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const where = {
      chatId,
    };

    if (search) {
      where.content = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (type) {
      where.type = type;
    }

    if (senderId) {
      where.senderId = senderId;
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,

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

          reads: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        skip: (pageNumber - 1) * limitNumber,

        take: limitNumber,
      }),

      prisma.message.count({
        where,
      }),
    ]);

    return {
      messages,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async getMessageById(messageId) {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    return message;
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

  async markAsRead(userId, messageId) {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        chat: {
          include: {
            members: true,
          },
        },
        reads: true,
      },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    const membership = message.chat.members.find(
      (member) => member.userId === userId,
    );

    if (!membership) {
      throw new Error("You are not a member of this chat");
    }

    if (message.senderId === userId) {
      throw new Error("You cannot mark your own message as read");
    }

    const existingRead = await prisma.messageRead.findUnique({
      where: {
        messageId_userId: {
          messageId,
          userId,
        },
      },
    });

    if (existingRead) {
      return {
        message,
        read: existingRead,
        alreadyRead: true,
      };
    }

    const read = await prisma.messageRead.create({
      data: {
        messageId,
        userId,
      },
    });

    // Private chat үшін ескі isRead/readAt-ты да сақтап тұрамыз
    if (!message.chat.isGroup) {
      await prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          isRead: true,
          readAt: read.readAt,
        },
      });
    }

    return {
      message,
      read,
      alreadyRead: false,
    };
  }

  async markChatAsRead(userId, chatId) {
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

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    const unreadMessages = await prisma.message.findMany({
      where: {
        chatId,
        senderId: {
          not: userId,
        },
        reads: {
          none: {
            userId,
          },
        },
      },
      select: {
        id: true,
        senderId: true,
      },
    });

    if (unreadMessages.length === 0) {
      return {
        count: 0,
        messageIds: [],
        senderIds: [],
        readAt: null,
      };
    }

    const readAt = new Date();

    await prisma.messageRead.createMany({
      data: unreadMessages.map((message) => ({
        messageId: message.id,
        userId,
        readAt,
      })),
      skipDuplicates: true,
    });

    // Private chat-та бұрынғы isRead/readAt өрістерін де жаңартамыз
    if (!chat.isGroup) {
      await prisma.message.updateMany({
        where: {
          id: {
            in: unreadMessages.map((message) => message.id),
          },
        },
        data: {
          isRead: true,
          readAt,
        },
      });
    }

    return {
      count: unreadMessages.length,

      messageIds: unreadMessages.map((message) => message.id),

      senderIds: [
        ...new Set(unreadMessages.map((message) => message.senderId)),
      ],

      readAt,
    };
  }

  async sendFileMessage(userId, chatId, file, data) {
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

    const { content, replyToId } = data;

    let replyTo = null;

    if (replyToId) {
      replyTo = await prisma.message.findUnique({
        where: {
          id: replyToId,
        },
      });

      if (!replyTo) {
        throw new Error("Reply message not found");
      }

      if (replyTo.chatId !== chatId) {
        throw new Error("Reply message belongs to another chat");
      }
    }

    let type = "FILE";

    if (file.mimetype.startsWith("image/")) {
      type = "IMAGE";
    }

    const fileUrl = `/uploads/${file.filename}`;

    const message = await prisma.message.create({
      data: {
        content: content || file.originalname,

        type,

        fileUrl,

        fileName: file.originalname,

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

        reads: {
          include: {
            user: {
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
}

module.exports = new MessageService();

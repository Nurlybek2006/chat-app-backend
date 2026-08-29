const prisma = require('../../config/prisma');

class ChatService {
  async createPrivateChat(currentUserId, otherUserId) {
    if (currentUserId === otherUserId) {
      throw new Error('You cannot create a private chat with yourself');
    }

    const otherUser = await prisma.user.findUnique({
      where: {
        id: otherUserId,
      },
    });

    if (!otherUser) {
      throw new Error('User not found');
    }

    const existingChats = await prisma.chat.findMany({
      where: {
        isGroup: false,
        members: {
          some: {
            userId: currentUserId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    const existingChat = existingChats.find((chat) => {
      const memberIds = chat.members.map((member) => member.userId);

      return (
        memberIds.length === 2 &&
        memberIds.includes(currentUserId) &&
        memberIds.includes(otherUserId)
      );
    });

    if (existingChat) {
      return existingChat;
    }

    const chat = await prisma.chat.create({
      data: {
        isGroup: false,
        creatorId: currentUserId,

        members: {
          create: [
            {
              userId: currentUserId,
              role: 'MEMBER',
            },
            {
              userId: otherUserId,
              role: 'MEMBER',
            },
          ],
        },
      },

      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                status: true,
                lastSeen: true,
              },
            },
          },
        },
      },
    });

    return chat;
  }

  async createGroupChat(currentUserId, data) {
    const { name, memberIds } = data;

    if (!name || name.trim().length < 1) {
      throw new Error('Group name is required');
    }

    if (!Array.isArray(memberIds)) {
      throw new Error('memberIds must be an array');
    }

    const uniqueMemberIds = [
      ...new Set([
        currentUserId,
        ...memberIds,
      ]),
    ];

    if (uniqueMemberIds.length < 3) {
      throw new Error(
        'Group chat must contain at least 3 users'
      );
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: uniqueMemberIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (users.length !== uniqueMemberIds.length) {
      throw new Error('One or more users were not found');
    }

    const chat = await prisma.chat.create({
      data: {
        name,
        isGroup: true,
        creatorId: currentUserId,

        members: {
          create: uniqueMemberIds.map((userId) => ({
            userId,
            role:
              userId === currentUserId
                ? 'ADMIN'
                : 'MEMBER',
          })),
        },
      },

      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                status: true,
                lastSeen: true,
              },
            },
          },
        },
      },
    });

    return chat;
  }

  async getChats(userId) {
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },

      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                status: true,
                lastSeen: true,
              },
            },
          },
        },

        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,

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

        _count: {
          select: {
            messages: true,
          },
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return chats;
  }

  async getChatById(chatId, userId) {
    const membership = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    if (!membership) {
      throw new Error('You are not a member of this chat');
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },

      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                status: true,
                lastSeen: true,
              },
            },
          },
        },
      },
    });

    if (!chat) {
      throw new Error('Chat not found');
    }

    return chat;
  }
}

module.exports = new ChatService();
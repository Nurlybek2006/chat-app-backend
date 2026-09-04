const prisma = require("../../config/prisma");

class ChatService {
  async createPrivateChat(currentUserId, otherUserId) {
    if (currentUserId === otherUserId) {
      throw new Error("You cannot create a private chat with yourself");
    }

    const otherUser = await prisma.user.findUnique({
      where: {
        id: otherUserId,
      },
    });

    if (!otherUser) {
      throw new Error("User not found");
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
              role: "MEMBER",
            },
            {
              userId: otherUserId,
              role: "MEMBER",
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
      throw new Error("Group name is required");
    }

    if (!Array.isArray(memberIds)) {
      throw new Error("memberIds must be an array");
    }

    const uniqueMemberIds = [...new Set([currentUserId, ...memberIds])];

    if (uniqueMemberIds.length < 3) {
      throw new Error("Group chat must contain at least 3 users");
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
      throw new Error("One or more users were not found");
    }

    const chat = await prisma.chat.create({
      data: {
        name,
        isGroup: true,
        creatorId: currentUserId,

        members: {
          create: uniqueMemberIds.map((userId) => ({
            userId,
            role: userId === currentUserId ? "ADMIN" : "MEMBER",
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
            createdAt: "desc",
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
        updatedAt: "desc",
      },
    });

    const chatsWithUnreadCount = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await prisma.message.count({
          where: {
            chatId: chat.id,

            senderId: {
              not: userId,
            },

            reads: {
              none: {
                userId,
              },
            },
          },
        });
        return {
          ...chat,
          unreadCount,
        };
      }),
    );

    return chatsWithUnreadCount;
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
      throw new Error("You are not a member of this chat");
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
      throw new Error("Chat not found");
    }

    return chat;
  }

  async addMember(userId, chatId, memberId) {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    if (!chat.isGroup) {
      throw new Error("Members can only be added to group chats");
    }

    const requester = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    if (!requester) {
      throw new Error("You are not a member of this chat");
    }

    if (requester.role !== "ADMIN") {
      throw new Error("Only chat admin can add members");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const existingMember = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId: memberId,
          chatId,
        },
      },
    });

    if (existingMember) {
      throw new Error("User is already a member of this chat");
    }

    const member = await prisma.chatMember.create({
      data: {
        userId: memberId,
        chatId,
        role: "MEMBER",
      },

      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return member;
  }

  async removeMember(userId, chatId, memberId) {
    const requester = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    if (!requester) {
      throw new Error("You are not a member of this chat");
    }

    if (requester.role !== "ADMIN") {
      throw new Error("Only chat admin can remove members");
    }

    if (userId === memberId) {
      throw new Error("Admin cannot remove himself");
    }

    const member = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId: memberId,
          chatId,
        },
      },
    });

    if (!member) {
      throw new Error("Member not found");
    }

    await prisma.chatMember.delete({
      where: {
        userId_chatId: {
          userId: memberId,
          chatId,
        },
      },
    });

    return {
      message: "Member removed",
    };
  }

  async updateMemberRole(userId, chatId, memberId, role) {
    const allowedRoles = ["ADMIN", "MEMBER"];

    if (!allowedRoles.includes(role)) {
      throw new Error("Invalid chat role");
    }

    const requester = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    if (!requester) {
      throw new Error("You are not a member of this chat");
    }

    if (requester.role !== "ADMIN") {
      throw new Error("Only chat admin can change member roles");
    }

    if (userId === memberId) {
      throw new Error("Admin cannot change his own role");
    }

    const member = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId: memberId,
          chatId,
        },
      },
    });

    if (!member) {
      throw new Error("Member not found");
    }

    return prisma.chatMember.update({
      where: {
        userId_chatId: {
          userId: memberId,
          chatId,
        },
      },

      data: {
        role,
      },

      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  async updateGroup(userId, chatId, data) {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    if (!chat.isGroup) {
      throw new Error("Only group chats can be updated");
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

    if (membership.role !== "ADMIN") {
      throw new Error("Only chat admin can update group");
    }

    const { name } = data;

    if (!name || !name.trim()) {
      throw new Error("Group name is required");
    }

    return prisma.chat.update({
      where: {
        id: chatId,
      },

      data: {
        name: name.trim(),
      },
    });
  }

  async getMembers(userId, chatId) {
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

    const members = await prisma.chatMember.findMany({
      where: {
        chatId,
      },

      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            status: true,
            lastSeen: true,
          },
        },
      },

      orderBy: {
        joinedAt: "asc",
      },
    });

    return members;
  }
}

module.exports = new ChatService();

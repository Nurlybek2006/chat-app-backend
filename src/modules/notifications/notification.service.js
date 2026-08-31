const prisma = require("../../config/prisma");

class NotificationService {
  async createNotification(data) {
    const { userId, type, title, content, link } = data;

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        content,
        link: link || null,
      },
    });

    return notification;
  }

  async getNotifications(userId) {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  }

  async getUnreadCount(userId) {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return count;
  }

  async markAsRead(userId, notificationId) {
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("You cannot access this notification");
    }

    return prisma.notification.update({
      where: {
        id: notificationId,
      },

      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId) {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },

      data: {
        isRead: true,
      },
    });

    return result;
  }

  async deleteNotification(userId, notificationId) {
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("You cannot delete this notification");
    }

    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    return {
      message: "Notification deleted",
    };
  }

  async createMessageNotifications({ chatId, senderId, message }) {
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
                username: true,
              },
            },
          },
        },
      },
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    const senderMember = chat.members.find(
      (member) => member.userId === senderId,
    );

    const senderName = senderMember?.user?.username || "User";

    const recipients = chat.members.filter(
      (member) => member.userId !== senderId,
    );

    const notifications = [];

    for (const member of recipients) {
      const notification = await prisma.notification.create({
        data: {
          userId: member.userId,

          type: "NEW_MESSAGE",

          title: chat.isGroup
            ? `New message in ${chat.name}`
            : `New message from ${senderName}`,

          content:
            message.type === "TEXT"
              ? message.content
              : message.type === "IMAGE"
                ? "Sent an image"
                : "Sent a file",

          link: `/chats/${chatId}`,
        },
      });

      notifications.push(notification);
    }

    return notifications;
  }
}

module.exports = new NotificationService();

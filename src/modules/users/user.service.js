const prisma = require('../../config/prisma');

class UserService {
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        status: true,
        lastSeen: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateProfile(userId, data) {
    const { username, avatar } = data;

    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new Error('Username already exists');
      }
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(username !== undefined && { username }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        status: true,
        lastSeen: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async searchUsers(query, currentUserId) {
    if (!query || query.trim().length < 1) {
      return [];
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: currentUserId,
            },
          },
          {
            OR: [
              {
                username: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        status: true,
        lastSeen: true,
      },
      take: 20,
    });

    return users;
  }
}

module.exports = new UserService();
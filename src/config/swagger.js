const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Real-Time Chat API",
      version: "1.0.0",
      description: "Real-Time Chat & Notification Platform API",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",

          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            email: {
              type: "string",
              format: "email",
              example: "nurlybek@test.com",
            },

            username: {
              type: "string",
              example: "nurlibek06",
            },

            avatar: {
              type: "string",
              nullable: true,
              example: "https://example.com/avatar.png",
            },

            status: {
              type: "string",
              enum: ["ONLINE", "OFFLINE"],
            },

            lastSeen: {
              type: "string",
              format: "date-time",
            },

            role: {
              type: "string",
              enum: ["ADMIN", "MODERATOR", "USER"],
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },

            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        ChatMember: {
          type: "object",

          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            userId: {
              type: "string",
              format: "uuid",
            },

            chatId: {
              type: "string",
              format: "uuid",
            },

            role: {
              type: "string",
              enum: ["ADMIN", "MEMBER"],
            },

            joinedAt: {
              type: "string",
              format: "date-time",
            },

            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },

        Chat: {
          type: "object",

          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            name: {
              type: "string",
              nullable: true,
              example: "Backend Developers",
            },

            isGroup: {
              type: "boolean",
            },

            creatorId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },

            unreadCount: {
              type: "integer",
              example: 2,
            },

            members: {
              type: "array",

              items: {
                $ref: "#/components/schemas/ChatMember",
              },
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },

            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        MessageRead: {
          type: "object",

          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            messageId: {
              type: "string",
              format: "uuid",
            },

            userId: {
              type: "string",
              format: "uuid",
            },

            readAt: {
              type: "string",
              format: "date-time",
            },

            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },

        Message: {
          type: "object",

          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            content: {
              type: "string",
              example: "Hello!",
            },

            type: {
              type: "string",
              enum: ["TEXT", "IMAGE", "FILE"],
            },

            fileUrl: {
              type: "string",
              nullable: true,
              example: "/uploads/example.png",
            },

            fileName: {
              type: "string",
              nullable: true,
              example: "example.png",
            },

            senderId: {
              type: "string",
              format: "uuid",
            },

            chatId: {
              type: "string",
              format: "uuid",
            },

            replyToId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },

            isRead: {
              type: "boolean",
            },

            readAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },

            sender: {
              $ref: "#/components/schemas/User",
            },

            reads: {
              type: "array",

              items: {
                $ref: "#/components/schemas/MessageRead",
              },
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },

            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Notification: {
          type: "object",

          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            userId: {
              type: "string",
              format: "uuid",
            },

            type: {
              type: "string",
              example: "NEW_MESSAGE",
            },

            title: {
              type: "string",
              example: "New message in Backend Developers",
            },

            content: {
              type: "string",
              example: "Notification test",
            },

            link: {
              type: "string",
              nullable: true,
              example: "/chats/ef5cedf7-...",
            },

            isRead: {
              type: "boolean",
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Error: {
          type: "object",

          properties: {
            error: {
              type: "string",
              example: "Something went wrong",
            },
          },
        },

        Pagination: {
          type: "object",

          properties: {
            page: {
              type: "integer",
              example: 1,
            },

            limit: {
              type: "integer",
              example: 20,
            },

            total: {
              type: "integer",
              example: 50,
            },

            totalPages: {
              type: "integer",
              example: 3,
            },
          },
        },
      },
    },
  },

  apis: ["./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;

const prisma =
  require("../config/prisma");

const { verifyToken } =
  require("../utils/jwt");

const authMiddleware = async (
  req,
  res,
  next,
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization token required",
      });
    }

    const [type, token] =
      authHeader.split(" ");

    if (
      type !== "Bearer" ||
      !token
    ) {
      return res.status(401).json({
        error: "Invalid authorization format",
      });
    }

    const decoded =
      verifyToken(token);

    const user =
      await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },

        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          status: true,
        },
      });

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
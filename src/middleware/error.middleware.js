const notFoundHandler = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`,
  );

  error.statusCode = 404;

  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Multer errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      error: "File upload error",
      message: err.message,
    });
  }

  // Prisma unique constraint
  if (err.code === "P2002") {
    return res.status(409).json({
      error: "Resource already exists",
      fields: err.meta?.target || [],
    });
  }

  // Prisma record not found
  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Resource not found",
    });
  }

  // Invalid JSON
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      error: "Invalid JSON",
    });
  }

  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    error:
      statusCode === 500
        ? "Internal server error"
        : err.message,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
export const errorMiddleware = (err, req, res, next) => {
  // If the response has already started, delegate to Express.
  if (res.headersSent) {
    return next(err);
  }

  // Log the full error on the server for debugging.
  console.error(err);

  // Default to an internal server error.
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
  });
};

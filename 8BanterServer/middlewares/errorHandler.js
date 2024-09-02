
module.exports = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  // Handle specific Sequelize errors
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(", ");
  } else if (err.name === "NotFound") {
    statusCode = 404;
    message = "Resource not found";
  } else if (err.name === "Unauthorized") {
    statusCode = 401;
    message = "Unauthorized access";
  } else if (err.name === "Forbidden") {
    statusCode = 403;
    message = "Forbidden";
  } else if (err.name === "BadRequest") {
    statusCode = 400;
    message = "Bad Request";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  // Log the error for debugging
  console.error(err);

  // Send the error response
  res.status(statusCode).json({ error: message });
};

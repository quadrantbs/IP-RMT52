module.exports = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(", ");
  } else if (err.name === "NotFound") {
    statusCode = 404;
    message = err.message || "Resource not found";
  } else if (err.name === "Unauthorized") {
    statusCode = 401;
    message = err.message;
  } else if (err.name === "Forbidden") {
    statusCode = 403;
    message = err.message || "Forbidden";
  } else if (err.name === "BadRequest") {
    statusCode = 400;
    message = err.message;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "Conflict") {
    statusCode = 409;
    message = err.message || "Conflict occurred";
  }

  console.error(err);

  res.status(statusCode).json({ error: message });
};

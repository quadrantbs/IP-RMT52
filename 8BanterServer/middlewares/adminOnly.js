const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw { name: "Forbidden", message: "Access denied" };
  }
  next();
};

module.exports = adminOnly;

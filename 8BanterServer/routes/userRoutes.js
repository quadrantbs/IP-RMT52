const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authenticate = require("../middlewares/authenticate");
const adminOnly = require("../middlewares/adminOnly");

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.get("/", authenticate, adminOnly, UserController.getUsers);

module.exports = router;

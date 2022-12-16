const { Router } = require("express");
const usersController = require("../controllers/users");
const route = Router();

// GET /api/user
route.get("/", usersController.getUsers);

// GET /api/user/:username
route.get("/:username", usersController.getUser);

module.exports = route;

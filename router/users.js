const { Router } = require("express");
const usersController = require("../controllers/users");
const route = Router();

// GET /api/user
route.get("/", usersController.getUsers);

module.exports = route;

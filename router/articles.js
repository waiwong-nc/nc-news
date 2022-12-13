const { Router } = require("express");
const articlesController = require("../controllers/articles");
const route = Router();

// GET /api/articles
route.get("/", articlesController.getArticles);

module.exports = route;

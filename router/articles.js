const { Router } = require("express");
const articlesController = require("../controllers/articles");
const route = Router();

// GET /api/articles
route.get("/", articlesController.getArticles);

// GET /api/articles/:article_id
route.get("/:article_id", articlesController.getArticle);


// PATCH /api/articles/:article_id
route.patch("/:article_id", articlesController.patchArticle);

module.exports = route;

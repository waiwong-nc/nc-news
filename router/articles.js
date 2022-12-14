const { Router } = require("express");
const articlesController = require("../controllers/articles");
const route = Router();

// GET /api/articles
route.get("/", articlesController.getArticles);

// GET /api/articles/:article_id
route.get("/:article_id", articlesController.getArticle);

// POST /api/articles/:article_id
route.post("/:article_id/comments", articlesController.postComments);

module.exports = route;

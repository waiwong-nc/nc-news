const articlessModel = require("../models/articles");

// GET api/topics
exports.getArticles = (req, res, next) => {
  articlessModel
    .selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};


// GET api/article
exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  articlessModel
    .selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article: article});
    })
    .catch((err) => {
      next(err);
    });
};

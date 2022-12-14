const articlesModel = require("../models/articles");

// GET api/topics
exports.getArticles = (req, res, next) => {
  articlesModel
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
  articlesModel
    .selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article: article});
    })
    .catch((err) => {
      next(err);
    });
};



// PATCH api/article
exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
 
    articlesModel
      .updateArticle(article_id, req.body)
      .then((article) => {
        res.status(200).send({ article: article });
      })
      .catch((err) => {
        next(err);
      });
}
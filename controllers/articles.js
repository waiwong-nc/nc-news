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
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};


exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  articlesModel.insertComments(article_id, comment)
  .then(comment => {
    res.status(200).send({comment:comment});
  })
  .catch(err => {
    next(err);
  })


}
const articlesModel = require("../models/articles");


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

exports.getComments = (req, res, next) => {
 
  const { article_id } = req.params;
  articlesModel
    .selectComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};




exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  articlesModel
    .insertComments(article_id, comment)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};



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
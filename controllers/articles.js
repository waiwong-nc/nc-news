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





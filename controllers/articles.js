const articlesModel = require("../models/articles");

// Q4 : GET api/articles
// exports.getArticles = (req, res, next) => {
//   articlesModel
//     .selectAllArticles()
//     .then((articles) => {
//       res.status(200).send({ articles: articles });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };


// Q10 : GET api/articles?topic=<TOPIC>&sort_by=<COLNUM>&order=< ASC || DESC >
exports.getArticles = (req, res, next) => {
  articlesModel.selectAllArticles(req.query)
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

// GET api/article/comments
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

const commentsModel = require("../models/comments.js");

exports.deleteComments = (req, res, next) => {
  const { comment_id } = req.params;
  commentsModel
    .deleteComments(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

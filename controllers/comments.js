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

exports.patchComments = (req, res, next) => {
  const { comment_id } = req.params;
  
  commentsModel
    .updateComments(comment_id, req.body)
    .then((comment) => {
      res.status(200).send({comment});
    })
    .catch((err) => {
      next(err);
    });
};

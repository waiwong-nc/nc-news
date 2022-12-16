const { Router } = require("express");
const commentsController = require("../controllers/comments");
const route = Router();

// Q12: DELETE /api/comments/:comment_id
route.delete("/:comment_id", commentsController.deleteComments);

// 18. PATCH /api/comments/:comment_id
route.patch("/:comment_id", commentsController.patchComments);


module.exports = route;

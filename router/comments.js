const { Router } = require("express");
const commentsController = require("../controllers/comments");
const route = Router();

// Q12: DELETE /api/comments/:comment_id
route.delete("/:comment_id", commentsController.deleteComments);

module.exports = route;

const db = require("../db/connection");

exports.deleteComments = (comment_id) => {
  // Check if the id integer
  if (!Number.isInteger(+comment_id)) {
    return Promise.reject({ status: 400, msg: "Invalid ID" });
  }

  // Check if the comment_id exist
  return (
    db
      .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "ID Not Found" });
        }
      })
      // Validation Passed. Delete record
      .then(() => {
        return db.query("DELETE FROM comments WHERE comment_id = $1", [
          comment_id,
        ]);
      })
  );
};

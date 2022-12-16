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

exports.updateComments = (comment_id,body) => {
  
  // Error if ID value not valid
  if (!Number.isInteger(+comment_id)) {
    return Promise.reject({ status: 400, msg: "ID invalid" });
  }

  // Error if property "inc_votes" not in body
  if (!body.hasOwnProperty("inc_votes")) {
    return Promise.reject({ status: 400, msg: "Property Not Found" });
  }

  const { inc_votes } = body;
  if (!Number.isInteger(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Value Not Valid" });
  }

  return db.query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
  .then(({rows}) => {
    if (rows.length === 0 ){
      return Promise.reject({ status: 404, msg: "ID Not Found" });
    }

    return rows[0].votes;
  })
  .then((votes) => {
    return db
      .query(
        "UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *",
        [votes + +inc_votes, comment_id]
      )
      .then(({ rows }) => {
        return rows;
      });
  })



}

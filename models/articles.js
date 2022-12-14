const db = require("../db/connection");

exports.selectAllArticles = () => {
  const sql = `WITH cc AS ( 
            SELECT article_id, count(article_id)::int AS comment_count 
            FROM comments 
            GROUP BY article_id
        ) 
        SELECT  a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, COALESCE(comment_count,0)AS comment_count
        FROM articles as a
        LEFT JOIN cc
        ON cc.article_id = a.article_id
        ORDER BY created_at DESC;`;
;


  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};



exports.selectArticle = (article_id) => {

  const sql = `SELECT author, title, article_id, body, topic, created_at, votes
          FROM articles
          WHERE article_id = $1 `;


  return db.query(sql, [article_id]).then(({ rows }) => {

    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "ID Not Exist" });  
    }
    return rows;
  }); 
};

exports.insertComments = (article_id, comment) => {
  const { username, body } = comment;

  // Check if username and body exist in req.body
  if (!username || !body || !username.trim() || !body.trim()) {
    return Promise.reject({ status: 400, msg: "Invalid Input" });
  }

  // Check if article_id exist in Table:articles
  const sql = `SELECT *
        FROM articles
        WHERE article_id = $1 `;

  return db
    .query(sql, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID Not Exist" });
      };
    })
    .then(() => {
      // Check if username exist in Table:users
      const sql = `SELECT *
        FROM users
        WHERE username = $1 `;

      return db.query(sql, [username]) .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Invalid Username" });
        };
      });
    })
    .then(() => {
      // Pass all checking
      const sql = 
      ` INSERT INTO comments
        (body, votes, author, article_id)
        VALUES
        ($1,$2,$3,$4)
        RETURNING *;`;

      return db
        .query(sql, [body, 0, username, article_id])
        .then(({ rows }) => {
          return rows;
        });
    });
    
}
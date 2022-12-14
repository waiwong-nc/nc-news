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

exports.selectComments = (article_id) => {

  // Check if article_id is valid
  if (isNaN(article_id)) {
    return Promise.reject({ status: 404, msg: "Invalid ID" });
  }

  // Check if article_id is exist
  return db.query(`SELECT * FROM articles  WHERE article_id = $1 `, [article_id])
  .then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "ID Not Exist" });
    }
  })

  // After passing all the validation 
  .then(() => {
    const sql = `SELECT comment_id, votes, created_at, author, body
      FROM comments
      WHERE article_id = $1 
      ORDER BY created_at DESC;`;

    return db.query(sql, [article_id]).then(({ rows }) => {
      console.log(rows)
      return rows;
    });
  });
};
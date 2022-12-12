const db = require("../db/connection");

exports.selectAllArticles = () => {
  const sql = 
    `WITH cc AS ( 
            SELECT article_id, count(article_id) AS comment_count 
            FROM comments 
            GROUP BY article_id
        ) 
        SELECT  a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, comment_count 
        FROM articles as a
        LEFT JOIN cc
        ON cc.article_id = a.article_id
        ORDER BY created_at DESC;`;
;


  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};

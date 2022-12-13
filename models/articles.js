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

  const sql = ` SELECT article_id FROM articles`;
  return db
    .query(sql)
    .then(({ rows }) => {
      const idWhiteList = rows.map((row) => row.article_id);

      if (!idWhiteList.includes(+article_id)) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
    })
    .then(() => {
      const sql = `
          SELECT author, title, article_id, body, topic, created_at, votes
          FROM articles
          WHERE article_id = $1 `;
      return db.query(sql, [article_id]).then(({ rows }) => {
        return rows;
      });
    });
};
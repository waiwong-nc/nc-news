const db = require("../db/connection");
// // Q4 update => Q10
// exports.selectAllArticles = () => {
//   const sql = `WITH cc AS ( 
//             SELECT article_id, count(article_id)::int AS comment_count 
//             FROM comments 
//             GROUP BY article_id
//         ) 
//         SELECT  a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, COALESCE(comment_count,0)AS comment_count
//         FROM articles as a
//         LEFT JOIN cc
//         ON cc.article_id = a.article_id
//         ORDER BY created_at DESC;`;
// ;

//   return db.query(sql).then(({ rows }) => {
//     return rows;
//   });
// };







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
  if (!Number.isInteger(+article_id)) {
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




// Q10 : GET api/articles?topic=<TOPIC>&sort_by=<COLNUM>&order=< ASC || DESC >
exports.selectAllArticles = (queries) => {
  // Check if query'key valid
  const queryKeys = Object.keys(queries);
  const keyWhiteList = ["topic", "sort_by", "order"];
  for (let i = 0; i < queryKeys.length; i++) {
    if (!keyWhiteList.includes(queryKeys[i])) {
      return Promise.reject({ status: 400, msg: "Query Key Invalid" });
    }
  }

  const { topic, sort_by, order } = queries;
  const SortByWhiteList = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  let whereStatement = "";
  let orderByStatement = "";
  const values = [];

  // if contains query "topic"
  if (topic) {
    whereStatement = "WHERE topic = $1 ";
    values.push(topic);
  }

  // if contains query "sort_by"
  if (sort_by) {
    // Check if the sort_by value matches with whitelist
    if (!SortByWhiteList.includes(sort_by.trim())) {
      return Promise.reject({ status: 400, msg: "'Sort_by' Invalid" });
    }
    orderByStatement = `ORDER BY ${sort_by} `;
  } else {
    orderByStatement = `ORDER BY created_at `;
  }

  // if contains query "order"
  if (order) {
    //  Check if the "order" value is either "desc" or "asc"
    if (order !== "desc" && order !== "asc") {
      return Promise.reject({ status: 400, msg: "'Order' Invalid" });
    }
    orderByStatement += `${order} `;
  } else {
    orderByStatement += "DESC ";
  }

  const sql = 
    `WITH cc AS (
        SELECT article_id, count(article_id)::int AS comment_count
        FROM comments
        GROUP BY article_id
    )
    SELECT  a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, COALESCE(comment_count,0)AS comment_count
    FROM articles as a
    LEFT JOIN cc
    ON cc.article_id = a.article_id
    ${whereStatement}
    ${orderByStatement};`;

  return db.query(sql,values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return rows;
  });
};
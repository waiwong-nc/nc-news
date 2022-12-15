const db = require("../db/connection");

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


// Q6 : 
exports.selectComments = (article_id) => {

  // Check if article_id is valid
   if (!Number.isInteger(+article_id)) {
     return Promise.reject({ status: 400, msg: "Invalid ID" });
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
      return rows;
    });
  });
};

// Q7 : POST /api/articles/:article_id
exports.insertComments = (article_id, comment) => {
  const { username, body } = comment;

  // Check if username and body exist in req.body
  if (!username || !body ) {
    return Promise.reject({ status: 400, msg: "Missing Property" });
  }

  // Check if username and body exist empty
  if (username.trim().length == 0 || body.trim().length == 0) {
    return Promise.reject({ status: 400, msg: "Invalid Input" });
  }

  // Check if article_id exist in Table:articles
  return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID Not Exist" });
      }
    })
    .then(() => {
      // Check if username exist in Table:users
      return db.query("SELECT * FROM users WHERE username = $1 ", [username])
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Invalid Username" });
          }
        });
    })
    .then(() => {
      // Validation Passed
      const sql = ` INSERT INTO comments
        (body, votes, author, article_id)
        VALUES
        ($1,$2,$3,$4)
        RETURNING *;`;

      return db.query(sql, [body, 0, username, article_id]).then(({ rows }) => {
        return rows;
      });
    });
};




// Q8: PATCH /api/article
exports.updateArticle = (article_id, body) => {
  const { inc_votes } = body;

  // Check if inc_votes exist in req.body
   if (!Number.isInteger(+article_id)) {
     return Promise.reject({ status: 400, msg: "Invalid ID" });
   }

  // Check if inc_votes exist in req.body
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Missing Property" });
  }

  // Check if value in inc_votes valid
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid Input" });
  }

  // Check if article id exist
  return (
    db
      .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Non Existent ID" });
        }
        return rows[0].votes;
      })
      // Passed all validation
      .then((votes) => {
        const sql = `UPDATE articles 
    SET votes = $1 
    WHERE article_id = $2
    RETURNING *; `;
        return db.query(sql, [votes + inc_votes, article_id]);
      })
      .then(({ rows }) => {
        return rows;
      })
  );
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
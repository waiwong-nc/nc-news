const db = require("../db/connection");

// 9. GET /api/users
exports.selectAllUsers = () => {
  const sql = `SELECT * FROM users`;
  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};


// 17. GET /api/user/username
exports.selectUserByUsername = (username) => {
  const sql = `SELECT * FROM users WHERE username = $1`;
  return db.query(sql, [username]).then(({ rows }) => {
    if (rows.length === 0 ) {
      return Promise.reject({status:404,msg:"User Not Found"});
    }
    return rows;
  });
};
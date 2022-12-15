const db = require("../db/connection");

// 9. GET /api/users
exports.selectAllUsers = () => {
  const sql = `SELECT * FROM users`;
  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};

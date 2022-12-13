const db = require("../db/connection");

exports.selectAllUsers = () => {
  const sql = `SELECT *
     FROM users
    `;
  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};

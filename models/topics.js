const db = require("../db/connection");


exports.selectAllTopics = () => {
    const sql = 
    `SELECT *
     FROM topics
    `;
    return db.query(sql).then(({ rows }) => {
        return rows;
    })
}
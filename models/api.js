const fs = require("fs/promises");

exports.readDescription = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`)
    .then((content) => {
      return JSON.parse(content);
    })
    .catch((err) => {
      return Promise.reject({ status: 500, msg: "Access Error" });
    });
};

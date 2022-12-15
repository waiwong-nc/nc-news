const usersModel = require("../models/users");

// GET api/users
exports.getUsers = (req, res, next) => {
  usersModel
    .selectAllUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

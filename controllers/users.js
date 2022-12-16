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

//GET api/users/:username
exports.getUser = (req, res, next) => {
  const { username } = req.params
  usersModel
    .selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

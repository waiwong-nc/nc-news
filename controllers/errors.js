exports.handle404Paths = (_, res) => {
  res.status(404).send({ msg: "Not Found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err)
  //  Handle Error from psql
  if (err.code === "22P02") {
    res.status(400).send("Bad Request");
  } else {
    next(err);
  }
};

exports.handle500Errors = (err, req, res, next) => {
  //  Handle Customer Error
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

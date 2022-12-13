const Express = require('express');
const app = Express();
const topicsRoute = require('./router/topics');
const usersRoute = require('./router/users');


app.use('/api/topics', topicsRoute);
app.use('/api/users',usersRoute);


// Path Not Found
app.use('*',( _ ,res) => {
    res.status(404).send({msg:'Not Found'});
});


// Error Handler
app.use((err, req, res, next) => {
  //  Handle Error from psql
  if (err.code === "22P02") {
    res.status(400).send("Bad Request");
  }

  //  Handle Customer Error
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app
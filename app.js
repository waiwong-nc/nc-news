const Express = require('express');
const app = Express();
const topicsRoute = require('./router/topics');
const articlesRoute = require("./router/articles");

app.use('/api/topics', topicsRoute);
app.use("/api/articles", articlesRoute);

app.use('*',( _ ,res) => {
    res.status(404).send({msg:'Page Not Found'});
});

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
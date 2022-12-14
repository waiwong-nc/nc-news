const Express = require("express");
const app = Express();
const topicsRoute = require("./router/topics");
const articlesRoute = require("./router/articles");
const commentsRoute = require('./router/comments');
const errorHandlers = require("./controllers/errors");

app.use(Express.json());

app.use("/api/topics", topicsRoute);
app.use("/api/articles", articlesRoute);
app.use("/api/comments", commentsRoute);

app.all("*", errorHandlers.handle404Paths);
app.use(errorHandlers.handleCustomErrors);
app.use(errorHandlers.handle500Errors);

module.exports = app;

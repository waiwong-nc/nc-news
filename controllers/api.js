const apiModel = require("../models/api");

exports.getDescription = (req,res, next) => {
        apiModel.readDescription()
        .then((content) => {
            res.status(200).send({ api: content });
        })
        .catch((err) => {
            next(err)
        })
};
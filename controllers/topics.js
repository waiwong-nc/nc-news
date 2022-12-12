const topicsModel = require('../models/topics');

// GET api/topics
exports.getTopic = (req,res,next) => {
    topicsModel.selectAllTopics()
    .then((topics) => {
        res.status(200).send({topics:topics});
    })
    .catch((err) => {
        next(err);
    });
}
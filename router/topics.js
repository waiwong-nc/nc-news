const { Router } = require('express');
const topicsController = require('../controllers/topics')
const route = Router();

// GET /api/topics
route.get('/',topicsController.getTopic);

module.exports = route
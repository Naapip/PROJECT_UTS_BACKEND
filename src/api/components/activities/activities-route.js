const express = require('express');
const activitiesController = require('./activities-controller');
const { authenticateToken } = require('../../middleware/auth'); // Menggunakan destructuring

const route = express.Router();

module.exports = (app) => {
  app.use('/activity', route);
  
  route.post('/', authenticateToken, activitiesController.createActivity);
  route.get('/', authenticateToken, activitiesController.getUserActivities);
  route.get('/thread/:id', activitiesController.getThreadActivities); // Publik, tidak perlu token
  route.delete('/:id', authenticateToken, activitiesController.deleteActivity);
};
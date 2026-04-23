const express = require('express');
const usersController = require('./users-controller');
const { authenticateToken } = require('../../middleware/auth');
const route = express.Router();

module.exports = (app) => {
  app.use('/auth', route); 
  route.post('/register', usersController.register);
  route.post('/login', usersController.login);

  const profileRoute = express.Router();
  app.use('/users', profileRoute);
  profileRoute.get('/:username', usersController.getProfile);
  profileRoute.put('/update', authenticateToken, usersController.updateProfile);
};
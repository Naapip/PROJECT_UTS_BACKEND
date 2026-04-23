const express = require('express');
const users = require('./components/users/users-route');
const threads = require('./components/threads/threads-route');
const replies = require('./components/replies/replies-route');

module.exports = () => {
  const app = express.Router();

  users(app);
  threads(app);
  replies(app);

  return app;
};
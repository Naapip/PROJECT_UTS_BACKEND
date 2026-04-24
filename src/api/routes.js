const express = require('express');
const users = require('./components/users/users-route');
const threads = require('./components/threads/threads-route');
const replies = require('./components/replies/replies-route');
const search  = require('./components/search/search-route');
const activitiesRoute = require('./components/activities/activities-route');
module.exports = () => {
  const app = express.Router();

  users(app);
  threads(app);
  replies(app);
  search(app);
  activitiesRoute(app);
  return app;
};
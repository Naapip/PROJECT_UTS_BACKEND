const express = require('express');
const repliesController = require('./replies-controller');
const { authenticateToken } = require('../../middleware/auth');
const route = express.Router();

module.exports = (app) => {
  app.use('/threads', route); // Base path tetap threads untuk nested

  route.post('/:id/reply', authenticateToken, repliesController.postReply);
  route.patch('/replies/:id', authenticateToken, repliesController.patchReply);
  route.delete('/replies/:id', authenticateToken, repliesController.deleteReply);
  route.get('/replies/user/:userId', repliesController.getUserReplies);
};
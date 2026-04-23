const express = require('express');
const threadsController = require('./threads-controller');
const { authenticateToken } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

const route = express.Router();

module.exports = (app) => {
  app.use('/threads', route);

  route.get('/', threadsController.getThreads);
  route.get('/:id', threadsController.getThreadDetail);
  route.post('/', authenticateToken, upload.single('image'), threadsController.postThread);
  route.delete('/:id', authenticateToken, threadsController.deleteThread);
};
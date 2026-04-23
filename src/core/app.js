const express = require('express');
const path = require('path');
const { connectDB, getDB } = require('./db');
const User = require('../models/users-schema');
const Thread = require('../models/threads-schema');

const routes = require('../api/routes');

const app = express();
app.use(express.json());

// Akses folder upload
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

const initializeApp = async () => {
  await connectDB();
  const db = getDB();
  
  // Menjalankan Indexing Database
  const userModel = new User(db);
  const threadModel = new Thread(db);
  await userModel.createIndexes();
  await threadModel.createIndexes();

  app.use('/api', routes());
  
  return app;
};

module.exports = initializeApp;
require('dotenv').config();
const express = require('express');
const { connectDB, getDB } = require('./db');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const threadRoutes = require('./src/routes/threads');
const User = require('./src/models/User');
const Thread = require('./src/models/Thread');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const initializeApp = async () => {
  try {
    await connectDB();
    
    const db = getDB();
    const userModel = new User(db);
    const threadModel = new Thread(db);
    
    await userModel.createIndexes();
    await threadModel.createIndexes();

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/threads', threadRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

initializeApp();
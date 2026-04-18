const express = require('express');
const router = express.Router();
const { getDB } = require('../../db');
const { authenticateToken } = require('../middleware/auth');
const { ObjectId } = require('mongodb');

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { content, images } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const db = getDB();
    const threadsCollection = db.collection('threads');

    const thread = {
      userId: new ObjectId(req.user.userId),
      username: req.user.username,
      content,
      images: images || [],
      likes: 0,
      replies: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await threadsCollection.insertOne(thread);

    res.status(201).json({
      message: 'Thread created successfully',
      thread: {
        id: result.insertedId,
        ...thread
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const db = getDB();
    const usersCollection = db.collection('users');
    const threadsCollection = db.collection('threads');

    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const threads = await threadsCollection
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      username: user.username,
      totalThreads: threads.length,
      threads
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { getDB } = require('../../db');
const { ObjectId } = require('mongodb');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    const db = getDB();
    
    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const newThread = {
      userId: new ObjectId(req.user.userId),
      username: req.user.username,
      content,
      image: imagePath, 
      createdAt: new Date(),
      replies: []
    };

    const result = await db.collection('threads').insertOne(newThread);
    res.status(201).json({ 
      message: "Thread created!", 
      threadId: result.insertedId,
      imagePath: imagePath 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const threads = await db.collection('threads')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const thread = await db.collection('threads').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const threadId = new ObjectId(req.params.id);
    
    const thread = await db.collection('threads').findOne({ _id: threadId });
    
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    
    if (thread.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized! You can only delete your own threads" });
    }

    await db.collection('threads').deleteOne({ _id: threadId });
    res.json({ message: "Thread deleted successfully" });
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
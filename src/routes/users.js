const express = require('express');
const router = express.Router();
const { getDB } = require('../../db');
const User = require('../models/User');
const Thread = require('../models/Thread');
const { authenticateToken } = require('../middleware/auth');

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const db = getDB();
    const userModel = new User(db);
    const threadModel = new Thread(db);

    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const threads = await threadModel.findByUserId(user._id);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto,
        isPrivate: user.isPrivate,
        createdAt: user.createdAt
      },
      threads
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { profilePhoto, isPrivate } = req.body;

    const db = getDB();
    const userModel = new User(db);

    const updateData = {};
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    const updatedUser = await userModel.updateProfile(req.user.userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePhoto: updatedUser.profilePhoto,
        isPrivate: updatedUser.isPrivate
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth'); // Middleware autentikasi kelompokmu

// 1. POST /api/activity - Create activity (like / repost / follow)
router.post('/', auth, async (req, res) => {
  try {
    const { type, threadId, targetUserId } = req.body;
    const userId = req.user.id;

    // Validasi input dasar
    if (!['like', 'repost', 'follow'].includes(type)) {
      return res.status(400).json({ message: 'Tipe activity tidak valid' });
    }

    const newActivity = new Activity({
      user: userId,
      type: type,
      thread: threadId || null,
      targetUser: targetUserId || null
    });

    await newActivity.save();
    res.status(201).json({ message: `Berhasil melakukan ${type}`, data: newActivity });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
});

// 2. GET /api/activity - Ambil semua activity / notifikasi user yang sedang login
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const activities = await Activity.find({
      $or: [
        { user: userId }, 
        { targetUser: userId }
      ]
    })
    .populate('user', 'username') // Ambil data username pembuat activity
    .populate('thread', 'content') // Ambil cuplikan konten thread
    .sort({ createdAt: -1 }); // Urutkan dari yang terbaru

    res.json({ data: activities });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
});

// 3. GET /api/activity/thread/:id - Lihat daftar activity pada thread tertentu
router.get('/thread/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const activities = await Activity.find({ thread: id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json({ data: activities });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
});

// 4. DELETE /api/activity/:id - Hapus activity (unlike / undo repost / unfollow)
router.delete('/:id', auth, async (req, res) => {
  try {
    const activityId = req.params.id;
    const userId = req.user.id;

    // Cari activity berdasarkan ID
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: 'Activity tidak ditemukan' });
    }

    // Pastikan hanya user yang membuat activity yang bisa menghapusnya
    if (activity.user.toString() !== userId) {
      return res.status(403).json({ message: 'Tidak diizinkan menghapus activity ini' });
    }

    await activity.deleteOne();
    res.json({ message: 'Activity berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
});

module.exports = router;
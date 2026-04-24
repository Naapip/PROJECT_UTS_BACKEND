const activitiesService = require('./activities-service');

// Fungsi pintar untuk otomatis mendeteksi format ID dari token
const getUserIdFromToken = (user) => {
  return user.userId || user.id || user._id;
};

async function createActivity(req, res, next) {
  try {
    const { type, thread_id, target_user_id } = req.body;
    const userId = getUserIdFromToken(req.user);

    // Jika token aneh/tidak terbaca, sistem akan menolak
    if (!userId) {
      console.log("Isi token dari auth.js:", req.user);
      return res.status(400).json({ error: "User ID tidak ditemukan dalam token login" });
    }

    const activity = await activitiesService.createActivity(userId, type, thread_id, target_user_id);
    return res.status(201).json({ message: 'Activity berhasil dicatat', data: activity });
  } catch (error) {
    return next(error);
  }
}

async function getUserActivities(req, res, next) {
  try {
    const userId = getUserIdFromToken(req.user);
    if (!userId) return res.status(400).json({ error: "User ID tidak valid" });

    const activities = await activitiesService.getUserActivities(userId);
    return res.status(200).json({ data: activities });
  } catch (error) {
    return next(error);
  }
}

async function getThreadActivities(req, res, next) {
  try {
    const threadId = req.params.id;
    const activities = await activitiesService.getThreadActivities(threadId);
    return res.status(200).json({ data: activities });
  } catch (error) {
    return next(error);
  }
}

async function deleteActivity(req, res, next) {
  try {
    const activityId = req.params.id;
    const userId = getUserIdFromToken(req.user);

    await activitiesService.deleteActivity(activityId, userId);
    return res.status(200).json({ message: 'Activity berhasil dihapus' });
  } catch (error) {
    if (error.message.includes('ditolak')) {
      return res.status(403).json({ error: error.message });
    }
    return next(error);
  }
}

module.exports = {
  createActivity,
  getUserActivities,
  getThreadActivities,
  deleteActivity,
};
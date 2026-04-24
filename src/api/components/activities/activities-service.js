const activitiesRepository = require('./activities-repository');

async function createActivity(userId, type, threadId, targetUserId) {
  if (!['like', 'repost', 'follow'].includes(type)) {
    throw new Error('Tipe activity tidak valid');
  }
  return await activitiesRepository.createActivity(userId, type, threadId, targetUserId);
}

async function getUserActivities(userId) {
  // Baris ini yang sebelumnya error, sekarang sudah dipastikan memanggil fungsi yang benar
  return await activitiesRepository.getUserActivities(userId);
}

async function getThreadActivities(threadId) {
  return await activitiesRepository.getThreadActivities(threadId);
}

async function deleteActivity(activityId, userId) {
  const activity = await activitiesRepository.getActivityById(activityId);
  if (!activity) {
    throw new Error('Activity tidak ditemukan');
  }
  
  if (activity.user_id.toString() !== userId.toString()) {
    throw new Error('Akses ditolak: Anda tidak dapat menghapus activity ini');
  }

  await activitiesRepository.deleteActivity(activityId);
  return true;
}

module.exports = {
  createActivity,
  getUserActivities,
  getThreadActivities,
  deleteActivity,
};
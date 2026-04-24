const { ObjectId } = require('mongodb');
const { getDB } = require('../../../core/db'); // Mengambil koneksi database dari teman Anda

async function createActivity(userId, type, threadId, targetUserId) {
  const db = getDB();
  
  const newActivity = {
    user_id: new ObjectId(userId),
    type: type,
    thread_id: threadId ? new ObjectId(threadId) : null,
    target_user_id: targetUserId ? new ObjectId(targetUserId) : null,
    created_at: new Date()
  };
  
  // Menggunakan fungsi insertOne bawaan Native MongoDB
  const result = await db.collection('activities').insertOne(newActivity);
  newActivity._id = result.insertedId;
  
  return newActivity;
}

async function getUserActivities(userId) {
  const db = getDB();
  
  // Karena tidak pakai Mongoose, kita gunakan $lookup untuk menggabungkan data user (pengganti populate)
  return await db.collection('activities').aggregate([
    { 
      $match: { 
        $or: [
          { user_id: new ObjectId(userId) }, 
          { target_user_id: new ObjectId(userId) }
        ] 
      } 
    },
    {
      $lookup: {
        from: 'users', // Asumsi nama tabel user dari teman Anda adalah 'users'
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $sort: { created_at: -1 } }
  ]).toArray();
}

async function getThreadActivities(threadId) {
  const db = getDB();
  
  return await db.collection('activities').aggregate([
    { $match: { thread_id: new ObjectId(threadId) } },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $sort: { created_at: -1 } }
  ]).toArray();
}

async function getActivityById(activityId) {
  const db = getDB();
  return await db.collection('activities').findOne({ _id: new ObjectId(activityId) });
}

async function deleteActivity(activityId) {
  const db = getDB();
  return await db.collection('activities').deleteOne({ _id: new ObjectId(activityId) });
}

module.exports = {
  createActivity,
  getUserActivities,
  getThreadActivities,
  getActivityById,
  deleteActivity,
};
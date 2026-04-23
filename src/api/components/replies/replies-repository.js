const { getDB } = require('../../../core/db');
const { ObjectId } = require('mongodb');

async function createReply(data) {
  const db = getDB();
  const result = await db.collection('threads').insertOne(data);
  return { _id: result.insertedId, ...data };
}

async function getReplyById(id) {
  const db = getDB();
  return db.collection('threads').findOne({ _id: new ObjectId(id) });
}

async function getRepliesByUserId(userId) {
  const db = getDB();
  return db.collection('threads').find({ 
    $and: [
      { 
        $or: [
          { userId: new ObjectId(userId) },
          { userId: userId }
        ]
      },
      { parentThreadId: { $ne: null } }
    ]
  }).toArray();
}

async function updateReplyContent(id, content) {
  const db = getDB();
  return db.collection('threads').updateOne(
    { _id: new ObjectId(id) },
    { $set: { content, editedAt: new Date() } }
  );
}

async function deleteReply(id) {
  const db = getDB();
  return db.collection('threads').deleteOne({ _id: new ObjectId(id) });
}

async function pullReplyFromParent(parentId, replyId) {
  const db = getDB();
  return db.collection('threads').updateOne(
    { _id: new ObjectId(parentId) },
    { $pull: { replies: new ObjectId(replyId) } }
  );
}

async function pushReplyToParent(parentId, replyId) {
  const db = getDB();
  return db.collection('threads').updateOne(
    { _id: new ObjectId(parentId) },
    { $push: { replies: new ObjectId(replyId) } } // Menggunakan $push agar array bertambah
  );
}

module.exports = { 
    createReply, 
    getReplyById, 
    updateReplyContent, 
    deleteReply, 
    pullReplyFromParent,
    getRepliesByUserId,
    pushReplyToParent
};
const { getDB } = require('../../../core/db');
const { ObjectId } = require('mongodb');

async function getThreads() {
  const db = getDB();
  return db.collection('threads')
    .find({ parentThreadId: null })
    .sort({ createdAt: -1 })
    .toArray();
}

async function getThreadById(id) {
  const db = getDB();
  return db.collection('threads').findOne({ _id: new ObjectId(id) });
}

async function getThreadsByUserId(userId) {
  const db = getDB();
  return db.collection('threads').find({ userId: new ObjectId(userId) }).toArray();
}

async function createThread(threadData) {
  const db = getDB();
  const result = await db.collection('threads').insertOne(threadData);
  return { _id: result.insertedId, ...threadData };
}

async function deleteThread(id) {
  const db = getDB();
  return db.collection('threads').deleteOne({ _id: new ObjectId(id) });
}

module.exports = { getThreads, getThreadById, getThreadsByUserId, createThread, deleteThread };
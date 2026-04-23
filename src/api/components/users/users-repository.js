const { getDB } = require('../../../core/db');
const { ObjectId } = require('mongodb');

async function findByEmail(email) {
  const db = getDB();
  return db.collection('users').findOne({ email });
}

async function findByUsername(username) {
  const db = getDB();
  return db.collection('users').findOne({ username });
}

async function createUser(userData) {
  const db = getDB();
  const result = await db.collection('users').insertOne(userData);
  return { _id: result.insertedId, ...userData };
}

async function updateProfile(id, updateData) {
  const db = getDB();
  return db.collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
}

module.exports = { findByEmail, findByUsername, createUser, updateProfile };
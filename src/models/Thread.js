const { ObjectId } = require('mongodb');

class Thread {
  constructor(db) {
    this.collection = db.collection('threads');
  }

  async findByUserId(userId) {
    return await this.collection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async createIndexes() {
    await this.collection.createIndex({ userId: 1 });
    await this.collection.createIndex({ createdAt: -1 });
  }
}

module.exports = Thread;
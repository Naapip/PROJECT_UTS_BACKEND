const { ObjectId } = require('mongodb');

class Thread {
  constructor(db) {
    this.collection = db.collection('threads');
  }

  // Menambahkan fungsi create yang mendukung nested thread
  async create(data) {
    const thread = {
      userId: new ObjectId(data.userId),
      username: data.username,
      content: data.content,
      image: data.image || null,
      parentThreadId: data.parentThreadId ? new ObjectId(data.parentThreadId) : null, // ID induk jika ini balasan
      replies: [], // Menyimpan daftar ID balasan
      createdAt: new Date()
    };
    const result = await this.collection.insertOne(thread);
    return { ...thread, _id: result.insertedId };
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
    await this.collection.createIndex({ parentThreadId: 1 });
  }
}

module.exports = Thread;
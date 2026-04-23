const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

class User {
  constructor(db) {
    this.collection = db.collection('users');
  }

  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      profilePhoto: userData.profilePhoto || null,
      isPrivate: userData.isPrivate || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.collection.insertOne(user);
    return { _id: result.insertedId, ...user };
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  async findByUsername(username) {
    return await this.collection.findOne({ username });
  }

  async findById(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async updateProfile(userId, updateData) {
  const update = {
    $set: {
      ...updateData,
      updatedAt: new Date()
    }
  };

  const result = await this.collection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    update,
    { returnDocument: 'after' }
  );

  return result; 
}

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async createIndexes() {
    await this.collection.createIndex({ email: 1 }, { unique: true });
    await this.collection.createIndex({ username: 1 }, { unique: true });
  }
}

module.exports = User;
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  // Siapa yang melakukan aktivitas (diambil dari token login)
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Jenis aktivitas
  type: { 
    type: String, 
    enum: ['like', 'repost', 'follow'], 
    required: true 
  },
  // ID Thread jika aktivitasnya adalah like / repost
  thread: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Thread',
    default: null
  },
  // ID User tujuan jika aktivitasnya adalah follow
  targetUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Activity', activitySchema);
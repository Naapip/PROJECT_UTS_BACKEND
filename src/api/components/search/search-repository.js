const { Users, Threads } = require('../../../models/User');

async function searchUsers(q) {
  return Users.find({
    $or: [
      { email: { $regex: q, $options: 'i' } },
      { fullName: { $regex: q, $options: 'i' } },
    ],
  }).select('-password');
}

async function searchThreads(q) {
  return Threads.find({
    content: { $regex: q, $options: 'i' },
  }).populate('userId', 'email fullName');
}

async function getFollowing(id) {
  return Users.findById(id)
    .populate('following', 'email fullName')
    .select('following');
}

async function getFollowers(id) {
  return Users.findById(id)
    .populate('followers', 'email fullName')
    .select('followers');
}

module.exports = {
  searchUsers,
  searchThreads,
  getFollowing,
  getFollowers,
};

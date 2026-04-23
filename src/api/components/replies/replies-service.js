const repliesRepository = require('./replies-repository');

async function sendReply(userId, username, content, image, parentId) {
  const data = {
    userId, username, content, image,
    parentThreadId: parentId,
    replies: [],
    createdAt: new Date()
  };
  const newReply = await repliesRepository.createReply(data);
  await repliesRepository.pushReplyToParent(parentId, newReply._id);
  return newReply;
}

async function editReply(replyId, userId, newContent) {
  const reply = await repliesRepository.getReplyById(replyId);
  
  if (!reply) throw new Error('REPLY_NOT_FOUND');
  if (reply.userId.toString() !== userId) throw new Error('UNAUTHORIZED');

  // Logika 5 Menit: (Sekarang - Waktu Dibuat)
  const now = new Date();
  const createdAt = new Date(reply.createdAt);
  const diffInMinutes = Math.floor((now - createdAt) / 1000 / 60);

  if (diffInMinutes > 5) {
    throw new Error('TIME_EXCEEDED');
  }

  return repliesRepository.updateReplyContent(replyId, newContent);
}

async function removeReply(replyId, userId) {
  const reply = await repliesRepository.getReplyById(replyId);
  if (!reply || !reply.parentThreadId) return null;
  if (reply.userId.toString() !== userId) throw new Error('UNAUTHORIZED');

  await repliesRepository.pullReplyFromParent(reply.parentThreadId, replyId);
  return repliesRepository.deleteReply(replyId);
}

async function getUserReplies(userId) {
  return repliesRepository.getRepliesByUserId(userId);
}

module.exports = { 
    sendReply, 
    editReply, 
    removeReply, 
    getUserReplies 
};
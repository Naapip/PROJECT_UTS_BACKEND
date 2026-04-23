const threadsRepository = require('./threads-repository');

async function getFeed() {
  return threadsRepository.getThreads();
}

async function getDetail(id) {
  return threadsRepository.getThreadById(id);
}

async function createNewThread(userId, username, content, image) {
  const data = {
    userId,
    username,
    content,
    image,
    parentThreadId: null,
    replies: [],
    createdAt: new Date()
  };
  return threadsRepository.createThread(data);
}

async function removeThread(threadId, userId) {
  const thread = await threadsRepository.getThreadById(threadId);
  if (!thread) throw new Error('THREAD_NOT_FOUND');
  if (thread.userId.toString() !== userId) throw new Error('UNAUTHORIZED');

  return threadsRepository.deleteThread(threadId);
}

module.exports = { getFeed, getDetail, createNewThread, removeThread };
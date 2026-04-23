const threadsService = require('./threads-service');

async function getThreads(req, res) {
  try {
    const threads = await threadsService.getFeed();
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function postThread(req, res) {
  try {
    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;
    const result = await threadsService.createNewThread(
      req.user.userId, 
      req.user.username, 
      req.body.content, 
      imagePath
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteThread(req, res) {
  try {
    await threadsService.removeThread(req.params.id, req.user.userId);
    res.json({ message: "Thread deleted successfully" });
  } catch (error) {
    const status = error.message === 'UNAUTHORIZED' ? 403 : 404;
    res.status(status).json({ error: error.message });
  }
}

async function getThreadDetail(req, res) {
  try {
    const thread = await threadsService.getDetail(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getThreads, postThread, deleteThread, getThreadDetail };
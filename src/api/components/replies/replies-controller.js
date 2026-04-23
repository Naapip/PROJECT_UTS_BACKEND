const repliesService = require('./replies-service');

async function postReply(req, res) {
  try {
    const { id } = req.params; // Parent ID
    const image = req.file ? req.file.path : null;
    const result = await repliesService.sendReply(req.user.userId, req.user.username, req.body.content, image, id);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function patchReply(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    await repliesService.editReply(id, userId, content);
    
    res.json({ message: 'Reply updated successfully' });
  } catch (error) {
    // Menangani error logika 5 menit atau unauthorized
    const status = error.message === 'TIME_EXCEEDED' ? 400 : 
                   error.message === 'UNAUTHORIZED' ? 403 : 500;
    res.status(status).json({ error: error.message });
  }
}

async function deleteReply(req, res) {
  try {
    await repliesService.removeReply(req.params.id, req.user.userId);
    res.json({ message: 'Reply deleted' });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
}

async function getUserReplies(req, res) {
  try {
    const { userId } = req.params;
    const replies = await repliesService.getUserReplies(userId);
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    postReply, 
    patchReply, 
    deleteReply, 
    getUserReplies 
};
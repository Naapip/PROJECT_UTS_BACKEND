const usersService = require('./users-service');

async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const result = await usersService.register(username, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await usersService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

async function getProfile(req, res) {
  try {
    const { username } = req.params;
    const user = await usersService.getProfile(username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePhoto: user.profilePhoto,
      isPrivate: user.isPrivate,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.user.userId; 
    const updateData = req.body;

    const result = await usersService.updateProfile(userId, updateData);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { register, login, getProfile, updateProfile };
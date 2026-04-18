const jwt = require('jsonwebtoken');

const JWT_SECRET = 'AAAXXXYYY111';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const generateToken = (userId, username) => {
  return jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  authenticateToken,
  generateToken,
  JWT_SECRET
};
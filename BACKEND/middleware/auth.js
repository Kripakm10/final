const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Authorization required' });

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid authorization format' });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Authorization required' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

module.exports = { auth, isAdmin };

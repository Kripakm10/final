const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../model/user');
const { createLog } = require('./logController');

const signup = async (req, res) => {
  try {
    const { fullName, email, password, phone, city } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashed, phone, city });
    await user.save();

    // Auto-login: create JWT token
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

    const userObj = user.toObject();
    delete userObj.password;

    // record signup activity
    try {
      createLog({ action: 'signup', entityType: 'user', entityId: user._id, message: 'New user signup', meta: { email }, createdBy: user._id });
    } catch (e) {
      console.error('signup log error', e);
    }

    return res.status(201).json({ message: 'User created', token, user: userObj });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // log failed login attempt (email not found)
      try {
        createLog({ action: 'login_failed', entityType: 'user', entityId: null, message: 'Login attempt - user not found', meta: { email, ip: req.ip, ua: req.get('user-agent') }, createdBy: null });
      } catch (e) {
        console.error('login_failed log error', e);
      }
      return res.status(404).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // log failed login attempt (wrong password)
      try {
        createLog({ action: 'login_failed', entityType: 'user', entityId: user._id, message: 'Invalid password', meta: { email, ip: req.ip, ua: req.get('user-agent') }, createdBy: user._id });
      } catch (e) {
        console.error('login_failed log error', e);
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    const userObj = user.toObject();
    delete userObj.password;

    // record successful login
    try {
      createLog({ action: 'login', entityType: 'user', entityId: user._id, message: 'User login', meta: { ip: req.ip, ua: req.get('user-agent') }, createdBy: user._id });
    } catch (e) {
      console.error('login log error', e);
    }

    return res.status(200).json({ message: `Welcome ${user.role}`, token, user: userObj });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If this email exists, a reset link will be sent' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // TODO: send email with token (omitted in this implementation)
    return res.status(200).json({ message: 'Password reset token generated', resetToken: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// CRUD: list, get, update, delete
const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User updated', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
};

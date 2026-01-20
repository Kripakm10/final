const ActivityLog = require('../model/log');

const createLog = async ({ action, entityType, entityId, message, meta, createdBy }) => {
  try {
    const log = new ActivityLog({ action, entityType, entityId, message, meta, createdBy });
    await log.save();
    return log;
  } catch (err) {
    console.error('Failed to create log', err);
  }
};

const listLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('createdBy', 'fullName email');
    return res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createLog, listLogs };
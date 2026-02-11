const WaterRequest = require('../model/water');
const mongoose = require('mongoose');
const { createLog } = require('./logController');

const createWater = async (req, res) => {
  try {
    const { name, email, phone, address, issueType, description, lat, lng } = req.body;
    const submittedBy = req.user?.id;
    // Generate 4-digit PIN
    const verificationPin = Math.floor(1000 + Math.random() * 9000).toString();
    const payload = { name, email, phone, address, issueType, description, submittedBy, verificationPin };
    if (typeof lat === 'number' && typeof lng === 'number') payload.location = { lat, lng };
    const doc = new WaterRequest(payload);
    await doc.save();

    createLog({ action: 'create', entityType: 'water', entityId: doc._id, message: `Water request created for ${name}`, createdBy: submittedBy });

    return res.status(201).json({ message: 'Request received', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const listMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await WaterRequest.find({ submittedBy: userId }).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const listWater = async (req, res) => {
  try {
    const items = await WaterRequest.find().sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateWater = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const updates = req.body;
    const doc = await WaterRequest.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'update', entityType: 'water', entityId: doc._id, message: `Water request updated (${JSON.stringify(updates)})`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Updated', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteWater = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await WaterRequest.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'delete', entityType: 'water', entityId: doc._id, message: `Water request deleted for ${doc.name}`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Schedule water resolution
const scheduleWater = async (req, res) => {
  try {
    const id = req.params.id;
    const { scheduledTime } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!scheduledTime) return res.status(400).json({ message: 'Scheduled time is required' });

    const doc = await WaterRequest.findByIdAndUpdate(
      id,
      {
        status: 'scheduled',
        scheduledTime: new Date(scheduledTime),
        scheduledBy: req.user?.id
      },
      { new: true }
    );

    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'schedule', entityType: 'water', entityId: doc._id, message: `Water resolution scheduled for ${new Date(scheduledTime).toLocaleString()}`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Scheduled successfully', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Report not resolved water issue
const reportNotResolved = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!reason || reason.trim().length === 0) return res.status(400).json({ message: 'Report reason is required' });

    const doc = await WaterRequest.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    // Add report
    doc.reports.push({
      reportedBy: req.user?.id,
      reason: reason.trim()
    });

    // Update status to not-resolved if scheduled time has passed
    if (doc.scheduledTime && new Date() > new Date(doc.scheduledTime)) {
      doc.status = 'not-resolved';
    }

    await doc.save();

    createLog({ action: 'report', entityType: 'water', entityId: doc._id, message: `Water issue not resolved - Report: ${reason}`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Report submitted successfully', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Assign water request to a worker (Admin only)
const assignWater = async (req, res) => {
  try {
    const id = req.params.id;
    const { workerId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request id' });
    if (!workerId) return res.status(400).json({ message: 'Worker ID is required' });

    const doc = await WaterRequest.findByIdAndUpdate(
      id, 
      { assignedTo: workerId, status: 'scheduled' }, // Auto-schedule
      { new: true }
    ).populate('assignedTo', 'fullName email phone');

    if (!doc) return res.status(404).json({ message: 'Request not found' });
    
    createLog({ action: 'assign', entityType: 'water', entityId: doc._id, message: `Assigned to worker ${workerId}`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Assigned successfully', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Worker verifies and closes the request
const verifyWater = async (req, res) => {
  try {
    const id = req.params.id;
    const { pin } = req.body;

    if (!pin) return res.status(400).json({ message: 'PIN is required' });
    
    const doc = await WaterRequest.findById(id);
    if (!doc) return res.status(404).json({ message: 'Request not found' });

    if (doc.verificationPin !== pin) {
      return res.status(400).json({ message: 'Invalid PIN. Please ask the citizen for the correct code.' });
    }

    doc.status = 'Resolved';
    doc.completionDate = new Date();
    await doc.save();

    createLog({ action: 'complete', entityType: 'water', entityId: doc._id, message: `Request resolved with PIN`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Request resolved successfully', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List tasks assigned to the current worker
const listAssignedWater = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await WaterRequest.find({ assignedTo: userId }).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  createWater, 
  listWater, 
  listMine, 
  updateWater, 
  deleteWater, 
  scheduleWater, 
  reportNotResolved,
  assignWater,
  verifyWater,
  listAssignedWater
};
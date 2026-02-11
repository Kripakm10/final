const WasteRequest = require('../model/waste');
const mongoose = require('mongoose');
const { createLog } = require('./logController');

// Create a new waste collection request
const createWaste = async (req, res) => {
  try {
    const { name, address, contact, wasteType, lat, lng } = req.body;
    const submittedBy = req.user?.id;
    // Generate 4-digit PIN
    const verificationPin = Math.floor(1000 + Math.random() * 9000).toString();
    const payload = { name, address, contact, wasteType, submittedBy, verificationPin };
    if (typeof lat === 'number' && typeof lng === 'number') payload.location = { lat, lng };
    const doc = new WasteRequest(payload);
    await doc.save();

    // log creation
    createLog({ action: 'create', entityType: 'waste', entityId: doc._id, message: `Waste request created for ${name}` , createdBy: submittedBy });

    return res.status(201).json({ message: 'Request received', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const listMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await WasteRequest.find({ submittedBy: userId }).sort({ submittedAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List waste requests (for admin)
const listWastes = async (req, res) => {
  try {
    const items = await WasteRequest.find().sort({ submittedAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update status or other fields
const updateWaste = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const updates = req.body;
    const doc = await WasteRequest.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'update', entityType: 'waste', entityId: doc._id, message: `Waste request updated (${JSON.stringify(updates)})`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Updated', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete request
const deleteWaste = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await WasteRequest.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'delete', entityType: 'waste', entityId: doc._id, message: `Waste request deleted for ${doc.name}`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Schedule a waste collection
const scheduleWaste = async (req, res) => {
  try {
    const id = req.params.id;
    const { scheduledTime } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!scheduledTime) return res.status(400).json({ message: 'Scheduled time is required' });

    const doc = await WasteRequest.findByIdAndUpdate(
      id,
      {
        status: 'scheduled',
        scheduledTime: new Date(scheduledTime),
        scheduledBy: req.user?.id
      },
      { new: true }
    );

    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'schedule', entityType: 'waste', entityId: doc._id, message: `Waste collection scheduled for ${new Date(scheduledTime).toLocaleString()}`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Scheduled successfully', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Report not collected waste
const reportNotCollected = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!reason || reason.trim().length === 0) return res.status(400).json({ message: 'Report reason is required' });

    const doc = await WasteRequest.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    // Add report
    doc.reports.push({
      reportedBy: req.user?.id,
      reason: reason.trim()
    });

    // Update status to not-collected if scheduled time has passed
    if (doc.scheduledTime && new Date() > new Date(doc.scheduledTime)) {
      doc.status = 'not-collected';
    }

    await doc.save();

    createLog({ action: 'report', entityType: 'waste', entityId: doc._id, message: `Waste not collected - Report: ${reason}`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Report submitted successfully', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Assign waste request to a worker (Admin only)
const assignWaste = async (req, res) => {
  try {
    const id = req.params.id;
    const { workerId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request id' });
    if (!workerId) return res.status(400).json({ message: 'Worker ID is required' });

    const doc = await WasteRequest.findByIdAndUpdate(
      id, 
      { assignedTo: workerId, status: 'scheduled' }, // Auto-schedule on assignment? Or keep pending? Let's say scheduled.
      { new: true }
    ).populate('assignedTo', 'fullName email phone');

    if (!doc) return res.status(404).json({ message: 'Request not found' });
    
    createLog({ action: 'assign', entityType: 'waste', entityId: doc._id, message: `Assigned to worker ${workerId}`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Assigned successfully', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Worker verifies and closes the request
const verifyWaste = async (req, res) => {
  try {
    const id = req.params.id;
    const { pin } = req.body;

    if (!pin) return res.status(400).json({ message: 'PIN is required' });
    
    const doc = await WasteRequest.findById(id);
    if (!doc) return res.status(404).json({ message: 'Request not found' });

    if (doc.verificationPin !== pin) {
      return res.status(400).json({ message: 'Invalid PIN. Please ask the citizen for the correct code.' });
    }

    doc.status = 'Resolved';
    doc.completionDate = new Date();
    await doc.save();

    createLog({ action: 'complete', entityType: 'waste', entityId: doc._id, message: `Request resolved with PIN`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Request resolved successfully', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List tasks assigned to the current worker
const listAssignedWaste = async (req, res) => {
  try {
    const userId = req.user.id;
    // Filter by assignedTo AND status not resolved? Or all? Usually "My Tasks" implies active ones.
    // Brief says "My Tasks" view. Let's return all assigned, frontend can filter or we filter here.
    // Let's return active ones primarily, or all sorted by date.
    const items = await WasteRequest.find({ assignedTo: userId }).sort({ submittedAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  createWaste, 
  listWastes, 
  listMine, 
  updateWaste, 
  deleteWaste, 
  scheduleWaste, 
  reportNotCollected,
  assignWaste,
  verifyWaste,
  listAssignedWaste
};
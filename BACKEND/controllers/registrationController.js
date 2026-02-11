const Registration = require('../model/registration');
const mongoose = require('mongoose');
const { createLog } = require('./logController');

const createRegistration = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address1,
      address2,
      city,
      district,
      zip,
      department,
      subOption,
    } = req.body;

    const { lat, lng } = req.body;
    const regPayload = {
      firstName,
      lastName,
      email,
      phone,
      address1,
      address2,
      city,
      district,
      zip,
      department,
      subOption,
    };
    if (typeof lat === 'number' && typeof lng === 'number') regPayload.location = { lat, lng };

    const reg = new Registration(regPayload);

    const submittedBy = req.user?.id;
    reg.submittedBy = submittedBy;
    await reg.save();

    createLog({ action: 'create', entityType: 'registration', entityId: reg._id, message: `Registration submitted for ${firstName} ${lastName || ''}`, createdBy: submittedBy });

    return res.status(201).json({ message: 'Registration submitted', registration: reg });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const listRegistrations = async (req, res) => {
  try {
    const items = await Registration.find().sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const listMineRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Registration.find({ submittedBy: userId }).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


const updateRegistration = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const updates = req.body;
    const doc = await Registration.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'update', entityType: 'registration', entityId: doc._id, message: `Registration updated (${JSON.stringify(updates)})`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Updated', registration: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteRegistration = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await Registration.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'delete', entityType: 'registration', entityId: doc._id, message: `Registration deleted for ${doc.firstName} ${doc.lastName || ''}`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createRegistration, listRegistrations, listMineRegistrations, updateRegistration, deleteRegistration };

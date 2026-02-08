const mongoose = require('mongoose');
const { Schema } = mongoose;

const waterSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, required: true, trim: true },
    issueType: { type: String, enum: ['leak', 'supply', 'quality', 'other'], default: 'other' },
    description: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'in-progress', 'resolved', 'scheduled', 'not-resolved', 'Resolved'], default: 'pending' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    verificationPin: { type: String },
    completionDate: { type: Date },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // optional geo location
    location: {
      lat: { type: Number },
      lng: { type: Number }
    },
    // scheduling fields
    scheduledTime: { type: Date },
    scheduledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // reports for not-resolved items
    reports: [
      {
        reportedAt: { type: Date, default: Date.now },
        reportedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        reason: { type: String },
        status: { type: String, enum: ['pending', 'acknowledged', 'resolved'], default: 'pending' }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('WaterRequest', waterSchema);

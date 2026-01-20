const mongoose = require('mongoose');
const { Schema } = mongoose;

const wasteSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    wasteType: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'scheduled', 'collected', 'not-collected'], default: 'pending' },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // optional geo location
    location: {
      lat: { type: Number },
      lng: { type: Number }
    },
    // scheduling fields
    scheduledTime: { type: Date },
    scheduledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // reports for not-collected items
    reports: [
      {
        reportedAt: { type: Date, default: Date.now },
        reportedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        reason: { type: String },
        status: { type: String, enum: ['pending', 'acknowledged', 'resolved'], default: 'pending' }
      }
    ]
  },
  { timestamps: { createdAt: 'submittedAt' } }
);

module.exports = mongoose.model('WasteRequest', wasteSchema);

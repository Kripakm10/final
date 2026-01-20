const mongoose = require('mongoose');
const { Schema } = mongoose;

const grievanceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // optional geo location
    location: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Grievance', grievanceSchema);

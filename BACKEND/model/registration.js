const mongoose = require('mongoose');
const { Schema } = mongoose;

const registrationSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address1: { type: String, trim: true },
    address2: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    zip: { type: String, trim: true },
    department: { type: String, trim: true },
    subOption: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // optional geo location
    location: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', registrationSchema);

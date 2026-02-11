const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema(
  {
    action: { type: String, required: true },
    entityType: { type: String, required: true }, // e.g., 'waste', 'registration', 'user'
    entityId: { type: Schema.Types.ObjectId, required: true },
    message: { type: String },
    meta: { type: Schema.Types.Mixed },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', logSchema);

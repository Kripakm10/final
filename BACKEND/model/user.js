const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        phone: { type: String, trim: true },
        city: { type: String, trim: true },
        role: { type: String, enum: ['admin', 'user'], default: 'user' },
        isVerified: { type: Boolean, default: false },
        resetToken: String,
        resetExpires: Date,
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
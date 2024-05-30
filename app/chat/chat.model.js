// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    message: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    recieverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);

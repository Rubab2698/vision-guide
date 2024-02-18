const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Request Schema
const requestSchema = new Schema({
    day: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    mentorId: {
        type: Schema.Types.ObjectId,
        ref: 'Profile', // Reference to the User model assuming mentors and mentees are users
        required: true
    },
    menteeId: {
        type: Schema.Types.ObjectId,
        ref: 'Profile', // Reference to the User model assuming mentors and mentees are users
        required: true
    },
    bidAmount: {
        type: Number, 
    }
},{
    timestamps: true,
    autopopulate: true
});

// Define ReqStatuses Schema
const reqStatusesSchema = new Schema({
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        required: true
    },
    mentorName: {
        type: String,
    },
    menteeName: {
        type: String,
    },
    mentorEmail: {
        type: String,
        required: true
    },
    menteeEmail: {
        type: String,
        required: true
    },
    requestId: {
        type: Schema.Types.ObjectId,
        ref: 'Request', // Reference to the Request model
        required: true
    },
    message: String,
    mentorId: {
        type: Schema.Types.ObjectId,
        ref: 'Profile', // Reference to the User model assuming mentors and mentees are users
        required: true
    },
    menteeId: {
        type: Schema.Types.ObjectId,
        ref: 'Profile', // Reference to the User model assuming mentors and mentees are users
        required: true
    },
},{
    timestamps: true,
    autopopulate: true
});

// Create models
const Request = mongoose.model('Request', requestSchema);
const ReqStatuses = mongoose.model('ReqStatuses', reqStatusesSchema);

module.exports = { Request, ReqStatuses };

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { reportType } = require('../general/enums');

const feedbackSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    feedback: {
        type: String
    },
    new: {
        type: Boolean
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    visible: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
});

const report = new Schema({
    feedbackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    },
    report: {
        type: String
    },
    reportType: {
        type: String,
        enum: [...Object.values(reportType)],
        default: reportType.OTHER
    }
},{
    timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

const Report = mongoose.model('Report', report);
module.exports = {Feedback, Report};
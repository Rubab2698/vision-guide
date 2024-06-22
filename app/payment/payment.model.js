const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Import autopopulate plugin

const paymentSchema = new Schema({
    status: {
        type: Boolean,
        default: false
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'MentorServiceSchema',
        autopopulate: true
    },
    req: {
        type: Schema.Types.ObjectId,
        ref: 'Request',
        autopopulate: true
    },
    mentee: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        autopopulate: true
    },
    mentor: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        autopopulate: true
    },
    amount: {
        type: Number,
        required: true
    },
    meetingId:String
}, {
    timestamps: true
});

// Create and export Payment model
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;

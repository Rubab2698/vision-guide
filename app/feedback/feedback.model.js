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
    rating: { type: Number, min: 1, max: 5, required: true },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MentorServiceSchema'
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },

},{
    timestamps: true
});



const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = {Feedback};
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { reqStatuses, languages } = require('../general/enums');
// Define Request Schema
const requestSchema = new Schema({
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: 'MentorServiceSchema', // Reference to the User model assuming mentors and mentees are users
        required: true   
    },
    eventId:[String],
    name: {
        type: String
    },
    day: {
        type: String,
        // required: true
    },
    date: {
        type: Date,
        // required: true
    },
    startTime: {
        type: String,
        // required: true
    },
    endTime: {
        type: String,
        // required: true
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
    },
    email: {
        type: String
    },
    topic: {
        type: String
    },
    description: {
        type: String
    },
    language: {
        type: String,
        enum: [...Object.values(languages)],
        default: languages.ENGLISH
    },
    requestType:{
        type:String,
        enum:['oneToOne', 'package','chat'],
        default: 'oneToOne'
    },
    package:{
       packageTime : [
        {
            startTime : String,
            endTime : String,
        }
       ]
    },
    status:{
        type:String,
        enum:['pending', 'accepted', 'rejected','done'],
        default: 'pending'
    },
    meetingLink : [String],
    amount : Number
},{
    timestamps: true,
    autopopulate: true
});

// Define ReqStatuses Schema
const reqStatusesSchema = new Schema({
    status: {
        type: String,
        enum: [...Object.values(reqStatuses)],
        default: reqStatuses.PENDING,
        required: true
    },   
    requestType:{
        type:String,
        enum:['oneToOne', 'package','chat'],
        default: 'oneToOne'
    },
    requestId: {
        type: Schema.Types.ObjectId,
        ref: 'Request', // Reference to the Request model
        required: true
    },
    message: String,
},{
    timestamps: true,
    autopopulate: true
});



// Create models

const Request = mongoose.model('Request', requestSchema);
const ReqStatuses = mongoose.model('ReqStatuses', reqStatusesSchema);

module.exports = { Request, ReqStatuses };

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { service } = require('../general/enums');

const mentorServiceSchema = new Schema(
    {
        serviceType: [{
            type: String,
            enum: Object.values(service),
            default: service.BASIC
        }],
        daysOfWeek: [String],
        availability: {
            startTime: String,
            endTime: String
        },
        noOfHours:
        {
            type: Number,
            default: 1
        },
        perHourRate: Number,
        cost: Number,
        mentorProfileId: { type: Schema.Types.ObjectId, ref: 'Profile', autopopulate: true },
        package: {
            packageTime: [
                {
                    day: String,
                    time: String,
                    date: Date
                }
            ],
            discount: Number
        }

    },
    {
        timestamps: true
    });

const MentorServiceSchema = mongoose.model('MentorServiceSchema', mentorServiceSchema);
module.exports = { MentorServiceSchema };









// analytics: {
//   viewers: Number,
//   amount_earned: Number,
//   bookings: Number,
//   ratings: Number,
//   referrals: Number,
//   reviews: Number,
//   invite_link: String
// }
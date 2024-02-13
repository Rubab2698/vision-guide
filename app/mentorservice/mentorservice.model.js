const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { service } = require('../general/enums');

const mentorServiceSchema = new Schema(
    {
        daysOfWeek: [String],
        availability : {
            startTime: String,
            endTime: String
        },
        noOfHours:
        {
            type: Number,
            default: 1
        },
        perHourRate: Number,
        discountOnPackage:{
            type:String,
            description: "discount on package",
        },
        servicePackages: {
            daysOfWeek:[String],
            discount: Number
        },
        cost: Number,
        mentorId: { type: Schema.Types.ObjectId, ref: 'Profile', autopopulate: true },
    },
    {
        timestamps: true
    });


const requestSchema = new Schema({
    mentorId: { type: Schema.Types.ObjectId, ref: 'Profile', autopopulate: true },
    menteeId: { type: Schema.Types.ObjectId, ref: 'Profile', autopopulate: true },
    mentorServiceSchemaId: { type: Schema.Types.ObjectId, ref: 'MentorServiceSchema', autopopulate: true },
    requestStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    message: String
})
mentorServiceSchema.pre('save', async function (next) {
    console.log("MentorServiceSchema pre save");
    try {
        if (this.isModified('servicePackages')) {
            const hours = this.servicePackages.daysOfWeek.length;
            this.cost = this.perHourRate * hours - this.servicePackages.discount;
        }
        next(); // Proceed with saving the document
    } catch (error) {
        next(error); // Pass any error to the next middleware in the stack
    }
});

mentorServiceSchema.pre('findOneAndUpdate', async function (next) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate && docToUpdate.servicePackages) {
        const hours = docToUpdate.servicePackages.daysOfWeek.length;
        this.set({ cost: docToUpdate.perHourRate * hours - docToUpdate.servicePackages.discount });
    }
    next();
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
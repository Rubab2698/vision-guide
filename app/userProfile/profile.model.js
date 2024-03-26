const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const { userTypes, platform, degree } = require('../general/enums');
const { boolean } = require('joi');

const profileSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true
    },
    profilePicture: String,
    userName: {
      firstName: String,
      lastName: String
    },
    role: {
      type: String,
      enum: Object.values(userTypes),
      default: userTypes.Mentee
    },
    phoneNumber: Number,
    headline: String,
    experiences: [
      {
        domain: String,
        technology: String,
        years: Number,
        companyName: String,
        joiningDate: Date,
        endDate: Date,
        description: String,
        designation: String
      }
    ],
    domains: [String],
    city: String,
    province: String,
    zipcode: String,
    languages: [String],
    social_media: {
      linkedin: String,
      github: String
    },
    featured: {
      type: Boolean,
      default: false
    },
    education: [
      {
        instituite: String,
        degree: {
          type: String,
          enum: Object.values(degree)
        },
        domain: String,
        startDate: Date,
        endDate: Date
      }
    ],
    introVideo: String,
    available: {
      type: Boolean,
      default: true
    },
    yearsOfExperience: Number,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true, autopopulate: true
  });


const Profile = mongoose.model('Profile', profileSchema);
module.exports = { Profile };









// analytics: {
//   viewers: Number,
//   amount_earned: Number,
//   bookings: Number,
//   ratings: Number,
//   referrals: Number,
//   reviews: Number,
//   invite_link: String
// }
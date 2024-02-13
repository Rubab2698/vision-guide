const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const { userTypes, platform } = require('../general/enums');

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: { ...Object.values(userTypes) },
    default: userTypes.USER
  },
  platform: {
    type: String,
    enum: {...Object.values(platform)},
  },
googleId: String,
phoneNumber: {
  type: Number,
},
});
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10); // Hash the password
      this.password = hashedPassword; // Set the hashed password in the schema
      next();
    } catch (error) {
      throw error;
    }
  } else {
    next();
  }
});
// userSchema.pre('save', async function (next) {
//   try {
//     // const salt = await bcrypt.genSalt(10)
//     // const hashedPassword = await bcrypt.hash(this.password, salt)
//     this.password = this.password
//     next()

//   } catch (error) {
//     next(error)
//   }
// })
// userSchema.methods.isValidPassword = async function (password) {
//   try {

//     return password == this.password //returns bolean
//   } catch (error) {
//     throw error
//   }
// }

const User = mongoose.model('User',userSchema)
module.exports = {
  User
}
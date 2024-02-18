const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  revoked: {
    type: Boolean,
    default: false
  },
  expireTime: {
    type: Date,
    required: true
  }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = {
  Token
};

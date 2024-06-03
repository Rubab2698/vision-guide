const mongoose = require('mongoose');
const { Schema } = mongoose;


const ChatSchema = new Schema({
    sender_id: {
        type: Schema.Types.ObjectId,
        ref: 'Profile', // Reference to the User model assuming mentors and mentees are users
        required: true
    },
    reciver_id :{
        type: Schema.Types.ObjectId,
        ref: 'Profile', // Reference to the User model assuming mentors and mentees are users
        required: true
    } ,
    message: String
})

const Chat = mongoose.model('Chat',ChatSchema)
module.exports = Chat
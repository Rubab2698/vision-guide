const mongoose =  require('mongoose')
const { Schema } = mongoose
const analyticsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        autopopulate: true
    },
    date: Date
})
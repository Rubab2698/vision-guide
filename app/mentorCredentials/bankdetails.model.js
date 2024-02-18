
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const bankDetails = new Schema({
    account_name: String,
    account_type: String,
    account_number: String,
    mentorID: { type: Schema.Types.ObjectId, ref: 'Profile', autopopulate: true },
},
    {
        timestamps: true
    });

const BankDetails = mongoose.model('BankDetails', bankDetails);
module.exports = { BankDetails };

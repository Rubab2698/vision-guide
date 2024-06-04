const  Chat  = require('./chat.model'); // Importing Mongoose models
const { Profile } = require('../userProfile/profile.model');
const { Request , ReqStatuses} = require('../request/request.model');
const chatStatus = async (body, user) => {
    const req = await Request.findById(body.requestId);
    if (!req) throw new Error('Request not found');

    const isUser = await Profile.findOne({ userId: user._id });
    if (isUser._id.toString() !== req.mentorId.toString()) {
        throw new Error("Unauthorized to create chatStatus");
    }
    const mentorId = req.mentorId;
    const menteeId = req.menteeId;
    const reqStatus = await ReqStatuses.create(body);
    if (!reqStatus) throw new Error('Request status not created')
    return { mentorId, menteeId, reqStatus };

};

const chatReq = async (body, user) => {
    const req = await Request.create(body);
    if (req) {
        return req;
    } else {
        throw new Error(`Error request for chat: ${error.message}`);
    }
};



const chatSave = async (body , user )=>{
    const chat = await Chat.create(...body)
    if(chat){
        return chat
    }
    else {
    throw new Error('Chat not created') 
}

}

module.exports = {
    chatStatus,
    chatReq,
    chatSave
}
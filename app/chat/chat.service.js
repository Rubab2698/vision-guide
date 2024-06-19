// Importing necessary models
const { Profile } = require('../userProfile/profile.model');
const { Request, ReqStatuses } = require('../request/request.model');
const { MessageModel, ChatModel } = require("./chat.model");


// chatStatus function
const chatStatus = async (body, user) => {
    const req = await Request.findById(body.requestId);
    if (!req) throw new Error('Request not found');
    
    req.status = body.status;
    await req.save();

    const isUser = await Profile.findOne({ userId: user._id });
    if (isUser._id.toString() !== req.mentorId.toString()) {
        throw new Error("Unauthorized to create chatStatus");
    }

    body.requestType = req.requestType;
    const mentorId = req.mentorId;
    const menteeId = req.menteeId;
    const reqStatus = await ReqStatuses.create(body);
    if (!reqStatus) throw new Error('Request status not created');
    
    return { mentorId, menteeId, reqStatus };
};

// chatReq function
const chatReq = async (body, user) => {
    try {
        const req = await Request.create(body);
        return req;
    } catch (error) {
        throw new Error(`Error request for chat: ${error.message}`);
    }
};

// chatSave function
const chatSave = async (body, user) => {
    try {
        const chat = await Chat.create(...body);
        return chat;
    } catch (error) {
        throw new Error('Chat not created');
    }
};

// createChat function
const createChat = async (req, res) => {
    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId],
    });
    try {
        const result = await newChat.save();
        return result
    } catch (error) {
        res.status(500).json(error);
    }
};

// userChats function
const userChats = async (req, res) => {
    try {
        const chat = await ChatModel.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error);
    }
};

// findChat function
const findChat = async (req, res) => {
    try {
        const chat = await ChatModel.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] },
        });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error);
    }
};

// addMessage function
const addMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const message = new MessageModel({
        chatId,
        senderId,
        text,
    });
    try {
        const result = await message.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// getMessages function
const getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await MessageModel.find({ chatId });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Exporting functions
module.exports = {
    chatStatus,
    chatReq,
    chatSave,
    createChat,
    userChats,
    findChat,
    addMessage,
    getMessages
};

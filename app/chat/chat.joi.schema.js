const Joi = require('joi');
const { languages } = require('../general/enums');

// Schema for createChatReq
const   createChatReqSchema = Joi.object({
    body: Joi.object({
        requestType: Joi.string().valid('chat').required(),
        mentorId: Joi.string().required(),
        menteeId: Joi.string().required(),
        topic: Joi.string(),
        description: Joi.string().max(500).min(10),
        language: Joi.string().valid(...Object.values(languages)).default(languages.ENGLISH),
    })
});

// Schema for createChatStatus
const createChatStatusSchema = Joi.object({
    body: Joi.object({
        status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
        requestId: Joi.string().required(),
        message: Joi.string(),
    })
});

// Schema for saveChat
const saveChatSchema = Joi.object({
    body: Joi.object({
        sender_id: Joi.string().required(),
        reciever_id: Joi.string().required(),
        message: Joi.string().required()
    })
});

// Schema for createChat
const createChatSchema = Joi.object({
    body: Joi.object({
        senderId: Joi.string().required(),
        receiverId: Joi.string().required()
    })
});

// Schema for userChats
const userChatsSchema = Joi.object({
    params: Joi.object({
        userId: Joi.string().required()
    })
});

// Schema for findChat
const findChatSchema = Joi.object({
    params: Joi.object({
        firstId: Joi.string().required(),
        secondId: Joi.string().required()
    })
});

// Schema for addMessage
const addMessageSchema = Joi.object({
    body: Joi.object({
        chatId: Joi.string().required(),
        senderId: Joi.string().required(),
        text: Joi.string().required()
    })
});

// Schema for getMessages
const getMessagesSchema = Joi.object({
    params: Joi.object({
        chatId: Joi.string().required()
    })
});

// Exporting schemas
module.exports = {
    createChatReqSchema,
    createChatStatusSchema,
    saveChatSchema,
    createChatSchema,
    userChatsSchema,
    findChatSchema,
    addMessageSchema,
    getMessagesSchema
};

const Joi = require('joi');
const { languages } = require('../general/enums');

const createChatReq = Joi.object({
    body: Joi.object({
      requestType: Joi.string().valid('chat').required(),
      mentorId: Joi.string().required(),
      menteeId: Joi.string().required(), 
      topic: Joi.string(),
      description: Joi.string().max(500).min(10),
      language: Joi.string().valid(...Object.values(languages)).default(languages.ENGLISH),
    })
  })
  

  const createChatStatusSchema = Joi.object({
    body: Joi.object({
      status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
      requestId: Joi.string().required(),
      message: Joi.string(),
    })
  });
  
  const saveChatScehma = Joi.object({
    body: Joi.object({
      sender_id: Joi.string().required(),
      reciever_id: Joi.string().required(),
      message: Joi.string().required()
    })
  })


  module.exports = {
    createChatReq,
    createChatStatusSchema,
    saveChatScehma
  } 
const chatController = require('./chat.controller');


const express = require('express');
const router = express.Router();
const { verifyAccessToken, authorizationMiddleware } = require('../authToken/auth.serivce');
const { validateSchema } = require('../general/joiValidation');
const joiValidation = require('./chat.joi.schema');

router.post('/',
    verifyAccessToken,
    // authorizationMiddleware(['Mentee', 'Admin']) ,
    validateSchema(joiValidation.createChatReq),
    chatController.createChatReq)


router.post('/status',
    verifyAccessToken,
    authorizationMiddleware(['Admin','Mentor']) ,
    validateSchema(joiValidation.createChatStatusSchema),
    chatController.chatReqStatus
)


router.post('/save-chat',
  validateSchema(joiValidation.saveChatScehma),
  chatController.saveChat
)


module.exports = router
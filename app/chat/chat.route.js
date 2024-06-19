const express = require('express')
const { verifyAccessToken, authorizationMiddleware } = require('../authToken/auth.serivce');
const { validateSchema } = require('../general/joiValidation');
const joiValidation = require('./chat.joi.schema');
const router = express.Router()
const chatController = require('./chat.controller');


router.post('/',
  verifyAccessToken,
  authorizationMiddleware(['Mentee', 'Admin']),
  validateSchema(joiValidation.createChatSchema),
  chatController.createNewChat);

router.post('/chatReq',
  verifyAccessToken,
  authorizationMiddleware(['Mentee', 'Admin']) ,
  validateSchema(joiValidation.createChatReqSchema),
  chatController.createChatReq)


router.post('/status',
  verifyAccessToken,
  authorizationMiddleware(['Admin', 'Mentor']),
  validateSchema(joiValidation.createChatStatusSchema),
  chatController.chatReqStatus
)


router.post('/message',
  verifyAccessToken,
  authorizationMiddleware(['Mentee', 'Admin']),
  validateSchema(joiValidation.addMessageSchema),
  chatController.createMessage);

router.get('/:userId',
  verifyAccessToken,
  authorizationMiddleware(['Mentee', 'Admin']),
  validateSchema(joiValidation.userChatsSchema),
  chatController.getUserChats);

router.get('/find/:firstId/:secondId',
  verifyAccessToken,
  authorizationMiddleware(['Mentee', 'Admin']),
  validateSchema(joiValidation.findChatSchema),
  chatController.getChat);

router.get('/message/:chatId',
  verifyAccessToken,
  authorizationMiddleware(['Mentee', 'Admin']),
  validateSchema(joiValidation.getMessagesSchema),
  chatController.fetchMessages);

module.exports = router
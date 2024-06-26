const express = require('express')
const { verifyAccessToken, authorizationMiddleware } = require('../authToken/auth.serivce');
const { validateSchema } = require('../general/joiValidation');
const joiValidation = require('./chat.joi.schema');
const router = express.Router()
const chatController = require('./chat.controller');


router.post('/',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
  validateSchema(joiValidation.createChatSchema),
  chatController.createNewChat);

router.delete('/:chatId',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
  validateSchema(joiValidation.getMessagesSchema),
  chatController.deleteChatRoom

)

router.post('/chatReq',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
  validateSchema(joiValidation.createChatReqSchema),
  chatController.createChatReq)


router.post('/status',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
  validateSchema(joiValidation.createChatStatusSchema),
  chatController.chatReqStatus
)


router.post('/message',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
  validateSchema(joiValidation.addMessageSchema),
  chatController.createMessage);

router.get('/:userId',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
  validateSchema(joiValidation.userChatsSchema),
  chatController.getUserChats);

router.get('/find/:firstId/:secondId',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
  validateSchema(joiValidation.findChatSchema),
  chatController.getChat);

router.get('/message/:chatId',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
  validateSchema(joiValidation.getMessagesSchema),
  chatController.fetchMessages);

module.exports = router
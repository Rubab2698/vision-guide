const userRouter = require('./authUser/user.routes');
const profileRouter = require('./userProfile/profile.route');
const userServiceRouter = require('./mentorservice/mentorservice.routes');
const userCredentialsRouter = require('./userBankDetails/bankdetails.route');
const requestRouter = require('./request/request.route');
const chatRouter = require('./chat/chat.route');
const feedback = require('./feedback/feedback.route');
const express = require('express');
const router = express.Router();

router.use('/auth',userRouter)
router.use('/profile',profileRouter)
router.use('/userCred',userCredentialsRouter)
router.use('/service',userServiceRouter)
router.use('/request',requestRouter)
router.use('/chat',chatRouter)
router.use('/feedback',feedback)

module.exports = router
const userRouter = require('./authUser/user.routes');
const profileRouter = require('./userProfile/profile.route');
const userServiceRouter = require('./mentorservice/mentorservice.routes');
const mentorCredentialsRouter = require('./mentorCredentials/bankdetails.route');
const requestRouter = require('./request/request.route');
const express = require('express');
const router = express.Router();

router.use('/auth',userRouter)
router.use('/profile',profileRouter)
router.use('/mentor',mentorCredentialsRouter)
router.use('/service',userServiceRouter)
router.use('/request',requestRouter)


module.exports = router
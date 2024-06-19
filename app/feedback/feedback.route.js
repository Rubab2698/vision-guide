const express = require('express');
const router = express.Router();
const controller = require('./mentorservice.controller');
const { verifyAccessToken, authorizationMiddleware } = require('../authToken/auth.serivce');
const { validateSchema } = require('../general/joiValidation');
const joiSchema= require('./feedback.joi.schema');




router.post(
    '/',
    verifyAccessToken,
    authorizationMiddleware(['Mentee', 'Admin']),
    validateSchema(joiSchema),
    controller.createFeedback
);


router.get(
    '/',
    validateSchema({}),
    controller.getFeedback
);


router.get(
    '/:feedbackId',
    verifyAccessToken,
    authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
    validateSchema({}),
    controller.getFeedbackById
)


router.report(
    '/:feedbackId',
    verifyAccessToken,
    authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
    validateSchema({}),
    controller.reportFeedback
)


router.delete(
    '/:feedbackId',
    verifyAccessToken,
    authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
    validateSchema({}),
    controller.deleteFeedback
)


router.patch(
    '/:feedbackId',
    verifyAccessToken,
    authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
    validateSchema({}),
    controller.updateFeedback
)   



















router.post(
    '/report',
    verifyAccessToken,
    authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
    validateSchema({}),
    controller.report   
)


router.get(
    '/report/:reportId',
    verifyAccessToken,
    authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
    validateSchema({}),
    controller.getReport
)   


router.get(
    '/report',
    validateSchema({}),
    controller.getReports
)       


router.patch(
    '/report/:reportId',
    verifyAccessToken,
    authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
    validateSchema({}),
    controller.updateReport

)
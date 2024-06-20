const express = require('express');
const router = express.Router();
const controller = require('./feedback.controller');
const { verifyAccessToken, authorizationMiddleware } = require('../authToken/auth.serivce');
const { validateSchema } = require('../general/joiValidation');
const joiSchema= require('./feedback.joi.schema');

router.post(
    '/',
    verifyAccessToken,
    authorizationMiddleware(['Mentee', 'Admin']),
    validateSchema(joiSchema.feedbackSchema),
    controller.createFeedback
);
router.get(
    '/mentor/:mentorId',
    validateSchema(joiSchema.getFeedBackByMentor),
    controller.getFeedback
);
router.get(
    '/:feedbackId',
    verifyAccessToken,
    authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
    validateSchema(joiSchema.getFeedBackById),
    controller.getFeedbackById
)
router.delete(
    '/:feedbackId',
    verifyAccessToken,
    authorizationMiddleware(['Mentor', 'Admin', 'Mentee']),
    validateSchema(joiSchema.getFeedBackById),
    controller.deleteFeedback
)


module.exports= router
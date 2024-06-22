const express = require('express');
const router = express.Router();
const controller = require('./payment.controller');
const { verifyAccessToken, authorizationMiddleware } = require('../authToken/auth.serivce');
const { validateSchema } = require('../general/joiValidation');
const joiSchema = require('./payment.joi.schema');



router.post(
    '/',
    verifyAccessToken,
    authorizationMiddleware(['Mentee', 'Admin']),
    validateSchema(joiSchema.payment),
    controller.createPayment
);


router.get('/:reqId',
    verifyAccessToken,
    authorizationMiddleware(['Mentee', 'Admin', 'Mentor']),
    validateSchema(joiSchema.getPayment),
    controller.getPayment
)


router.patch('/:reqId',
    verifyAccessToken,
    authorizationMiddleware(['Admin', 'Mentor']),
    validateSchema(joiSchema.updatePayment),
    controller.updatePayment
)
router.get('/meeting/:meetingId',
    validateSchema(joiSchema.getPaymentByMeetingId),
    controller.getPaymentByMeetingId
)

module.exports = router
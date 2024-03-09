const bankController = require('./bankdetails.controller');
const { verifyAccessToken, authorizationMiddleware } = require('../authToken/auth.serivce');
const { validateSchema } = require('../general/joiValidation');
const router = require('express').Router();
const {
    addBankDetailsSchema,
    updateBankDetailsSchema,
    idSchema,
    getAllBankDetails
} = require('./bankdetails.joi.schema')
router.route('/')
    .post(verifyAccessToken, validateSchema(addBankDetailsSchema), authorizationMiddleware(['Mentor', 'Admin']), bankController.addBankDetails)
    .get(verifyAccessToken, validateSchema(getAllBankDetails), authorizationMiddleware(['Admin']), bankController.getAllBankDetails)
router.route('/:id')
    .get(verifyAccessToken, validateSchema(idSchema), authorizationMiddleware(['Mentor', 'Admin']), bankController.getBankDetailsById)
    .patch(verifyAccessToken, validateSchema(updateBankDetailsSchema), authorizationMiddleware(['Mentor', 'Admin']), bankController.updateBankDetails)
    .delete(verifyAccessToken, validateSchema(idSchema), authorizationMiddleware(['Mentor', 'Admin']), bankController.deleteBankDetailsById)


module.exports = router
const Joi = require('joi');
const { service } = require('../general/enums');


const feedback = Joi.object({
    body: Joi.object({
        service: Joi.string().alphanum().min(24).max(24).required(),
        mentee: Joi.string().alphanum().min(24).max(24).required(),
        mentor: Joi.string().alphanum().min(24).max(24).required(),
        req: Joi.string().alphanum().min(24).max(24).required(),
        amount: Joi.number().required(),
        status: Joi.boolean().default(false)
    })


});

const updatePayment = Joi.object({
    params: ({
        reqId: Joi.string().alphanum().min(24).max(24).required()
    }),
    body:({
        status: Joi.boolean().default(false)
    })

})

const getPayment = Joi.object({
    params: ({
        reqId: Joi.string().alphanum().min(24).max(24).required()
    })

})

module.exports = {
    feedback,
    updatePayment,
    getPayment

};

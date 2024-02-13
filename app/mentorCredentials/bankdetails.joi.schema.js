const Joi = require('joi');


const addBankDetailsSchema = Joi.object({
    body: Joi.object({
        account_name: Joi.string().required(),
        account_type: Joi.string().required(),
        account_number: Joi.string().required(),
        mentorID: Joi.string().required(),
    })

})
const updateBankDetailsSchema = Joi.object({
    params: Joi.object({
        id: Joi.string().required()
    }),
    body: Joi.object({
        account_name: Joi.string(),
        account_type: Joi.string(),
        account_number: Joi.string(),
        mentorID: Joi.string(),
    })
})
const idSchema = Joi.object({
    params: Joi.object({
        id: Joi.string().required()
    })
})

const getAllBankDetails = Joi.object({
    query: Joi.object({
        sortBy: Joi.string(),
        page: Joi.number().integer().min(1).required(),
        limit: Joi.number().integer().min(1).required(),
    })
})


module.exports = {
    addBankDetailsSchema,
    updateBankDetailsSchema,
    idSchema,
    getAllBankDetails
}
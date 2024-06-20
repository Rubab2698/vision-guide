const Joi = require('joi');
const { reportType } = require('../general/enums');

const feedbackSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        rating: Joi.number().required(),
        serviceId: Joi.string().required(),
        menteeId:Joi.string().required(),
    })

});

const getFeedBackByMentor = Joi.object({
    params: Joi.object({
    mentorId: Joi.string().required(),   
    })
});

const getFeedBackById = Joi.object({
    params: Joi.object({
    feedbackId: Joi.string().required(),   
    })
});
module.exports = {
    feedbackSchema,
    getFeedBackByMentor,
    getFeedBackById
};

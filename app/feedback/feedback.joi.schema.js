const Joi = require('joi');
const { reportType } = require('../general/enums');

const feedbackSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    feedback: Joi.string().required(),
    new: Joi.boolean().required(),
    service: Joi.string().required(),
    mentor: Joi.string().required(),
    mentee: Joi.string().required(),
    visible: Joi.boolean()
});

const reportSchema = Joi.object({
    feedbackId: Joi.string().required(),
    report: Joi.string().required(),
    reportType: Joi.string().valid(...Object.values(reportType)).default(reportType.OTHER)
});

module.exports = {
    feedbackSchema,
    reportSchema
};

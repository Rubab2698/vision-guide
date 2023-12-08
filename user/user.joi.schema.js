const Joi = require('joi');
const allowedDomainExtensions = require('../general/enums')


const _register = Joi.object({
  body: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: allowedDomainExtensions }).lowercase().required(),
    password: Joi.string().min(8).required(),

  })
})
const loginSchema = Joi.object({

  body: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: allowedDomainExtensions }).lowercase().required(),
    password: Joi.string().min(8).required(),

  })

});
const signUpEmailSchema = Joi.object({

  body: Joi.object({
    userName: Joi.string().required(),
    profilePicture: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: allowedDomainExtensions }).lowercase().required(),
    password: Joi.string().min(8).required(),
    // role: Joi.string().valid('admin', 'customer'),

  })

});
const signUpGoogleSchema = Joi.object({
  body: Joi.object({
    userName:Joi.string().allow(''),
    email: Joi.string().email({ minDomainSegments: 2, tlds: allowedDomainExtensions }).lowercase().required(),
    profilePicture: Joi.string().allow(''),
    accessToken: Joi.string().required(),
  }),
});
const logoutSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().alphanum().min(24).max(24).required()
  })
})


module.exports = {
  loginSchema,
  logoutSchema,
  _register,
  signUpGoogleSchema,
  signUpEmailSchema
};

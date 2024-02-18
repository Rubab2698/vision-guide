const Joi = require('joi');
const { userTypes }= require('../general/enums')

const allowedDomainExtensions = require('../general/enums')


const _register = Joi.object({
  body: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: allowedDomainExtensions }).lowercase().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid(...Object.values(userTypes)).required(),
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
    role: Joi.string().valid(...Object.values(userTypes)).required(),
  })

});
const signUpGoogleSchema = Joi.object({
  body: Joi.object({
    token: Joi.string().required(),
    role: Joi.string().valid(...Object.values(userTypes)).required(),
  }),
});
const signUpPhoneSchema = Joi.object({
  body: Joi.object({
    token: Joi.string().required(),
  }),
});
const logoutSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().alphanum().min(24).max(24).required()
  })
})
const updateUserSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().alphanum().min(24).max(24).required()
}),
  body: Joi.object({
    fullName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    profilePicture: Joi.string(),
    userName: Joi.string(),
    role: Joi.string().valid('Customer', 'Admin'),
    platform: Joi.string().valid('google'), // Update with your platform values
    googleId: Joi.string(),
    phoneNumber: Joi.number(),
})
 
});
const idSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().alphanum().min(24).max(24).required()
}),
});
const refreshTokenSchema = Joi.object({
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
});


module.exports = {
  loginSchema,
  logoutSchema,
  _register,
  signUpGoogleSchema,
  signUpEmailSchema,
  signUpPhoneSchema,
  updateUserSchema,
  idSchema,
  refreshTokenSchema
};

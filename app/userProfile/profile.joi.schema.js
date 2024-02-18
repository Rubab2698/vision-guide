const Joi = require('joi');
const {degree} = require('../general/enums')
// const {objectId} = require("../general/joiValidation")
const bankDetailsSchema = Joi.object({
  account_name: Joi.string().required(),
  account_type: Joi.string().required(),
  account_number: Joi.string().required(),
});

const mentorProfileSchema = Joi.object({
  params: Joi.object({ 
    profileId: Joi.string().alphanum().min(24).max(24).required()
   }),
   query: Joi.object({
    sortBy: Joi.string(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
    search: Joi.string()
  }),
  body: Joi.object({
    email: Joi.string().email().lowercase(),
    profilepic: Joi.string(),
    userName: Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string()
    }),
    phoneNumber: Joi.number(),
    headline: Joi.string(),
    experiences: Joi.array().items(Joi.object({
      domain: Joi.string(),
      technology: Joi.string(),
      years: Joi.number(),
      companyName: Joi.string(),
      joiningDate: Joi.date(),
      endDate: Joi.date(),
      description: Joi.string()
    })),
    domains: Joi.array().items(Joi.string()),
    city: Joi.string(),
    province: Joi.string(),
    zipcode: Joi.string(),
    languages: Joi.array().items(Joi.string()),
    social_media: Joi.object({
      linkedin: Joi.string(),
      github: Joi.string()
    }),
    featured: Joi.boolean().default(false),
    education: Joi.object({
      instituite: Joi.string(),
      degree: Joi.string().valid(...Object.values(degree)),
      domain: Joi.string(),
      startDate: Joi.date(),
      endDate: Joi.date()
    }),
    introvideo: Joi.string(),
    available: Joi.boolean().default(true),
  })
});

const menteeProfileSchema = Joi.object({
  params: Joi.object({ 
    profileId: Joi.string().alphanum().min(24).max(24).required()
   }),
  query: Joi.object({
    sortBy: Joi.string(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
    search: Joi.string(),
    available:Joi.boolean(),
    role:Joi.string().valid('Mentor','Mentee','Both'),
    featured:Joi.boolean(),
    domains:Joi.array().items(Joi.string())
  }),
  body: Joi.object({
    profilePicture:Joi.string(),
    email: Joi.string().email().required(),
    userName: Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string()
    }),
    phoneNumber: Joi.number(),
    headline: Joi.string(),
    city: Joi.string(),
    languages: Joi.array().items(Joi.string()),
    featured:Joi.boolean(),
    available:Joi.boolean()
  })
});
 
const menteeUpdate =Joi.object({
  params: Joi.object({ 
    profileId: Joi.string().alphanum().min(24).max(24).required()
   }),
  body: Joi.object({
    profilePicture:Joi.string(),
    email: Joi.string().email().required(),
    userName: Joi.string(),
    phoneNumber: Joi.number(),
    headline: Joi.string(),
    city: Joi.string(),
    featured:Joi.boolean(),
  })
})
const idSchema = Joi.object({
  params: Joi.object({ 
    profileId: Joi.string().alphanum().min(24).max(24).required()
   }),
})

const getAllProfilesSchema = Joi.object({
  query: Joi.object({
    sortBy: Joi.string(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
    search: Joi.string(),
    domains: Joi.string(),
    languages: Joi.string(),
    role: Joi.string(),
    featured:Joi.boolean(),
    available:Joi.boolean()
  }),
})
module.exports = {
  mentorProfileSchema,
  menteeProfileSchema,
  idSchema,
  menteeUpdate,
  getAllProfilesSchema
};

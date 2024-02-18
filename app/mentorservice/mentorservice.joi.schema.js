const Joi = require('joi');

// Joi schema for creating a basic service
const createBasicServiceSchema = Joi.object({
  body: Joi.object({
    daysOfWeek: Joi.array().items(Joi.string()).required(),
    time: Joi.date().required(),
    noOfHours: Joi.number().default(1),
    perHourRate: Joi.number().required(),
    mentorId: Joi.string().required(),
    discountOnPackage: Joi.string().description('Discount on package'),
    servicePackages: Joi.object({
      daysOfWeek: Joi.array().items(Joi.string()),
      discount:Joi.number().required()
    }),
  })
});

// Joi schema for updating a basic service
const updateBasicServiceSchema = Joi.object({
  params: Joi.object({
    serviceId: Joi.string().alphanum().min(24).max(24).required()
  }),
  body: Joi.object({
    daysOfWeek: Joi.array().items(Joi.string()),
    time: Joi.date(),
    noOfHours: Joi.number(),
    perHourRate: Joi.number(),
    discountOnPackage: Joi.string().description('Discount on package'),
    servicePackages: Joi.object({
      daysOfWeek: Joi.array().items(Joi.string()),
      discount:Joi.number().required()
    }),
    mentorId: Joi.string(), // Assuming mentorId can be updated
  })
});

// Joi schema for deleting a basic service
const idSchema = Joi.object({
  params: Joi.object({
    serviceId: Joi.string().alphanum().min(24).max(24).required()
  })
});

// Joi schema for getting all basic services
const getAllBasicServiceSchema = Joi.object({
  query: Joi.object({
    sortBy: Joi.string(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required()
  })
});

module.exports = {
  createBasicServiceSchema,
  updateBasicServiceSchema,
  idSchema,
  getAllBasicServiceSchema
};

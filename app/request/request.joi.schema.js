const Joi = require('joi');

// Joi schema for creating a request
const createRequestSchema = Joi.object({
  body: Joi.object({
    day: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    mentorId: Joi.string().required(),
    menteeId: Joi.string().required(),
    date: Joi.date().required()
  })
});

// Joi schema for deleting a request
const deleteRequestSchema = Joi.object({
  params: Joi.object({
    requestId: Joi.string().alphanum().min(24).max(24).required()
  })
});

// Joi schema for getting a single request by ID
const getRequestByIdSchema = Joi.object({
  params: Joi.object({
    requestId: Joi.string().alphanum().min(24).max(24).required()
  })
});

// Joi schema for getting all requests by mentor ID
const getAllRequestsByMentorIdSchema = Joi.object({
  params: Joi.object({
    mentorId: Joi.string().required()   
  }),
  query: Joi.object({
    status: Joi.string().valid('pending', 'accepted', 'rejected'),
    sortBy: Joi.string(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required()
  })
});

// Joi schema for getting all requests by mentee ID
const getAllRequestsByMenteeIdSchema = Joi.object({
  query: Joi.object({
    menteeId: Joi.string().required(),
    status: Joi.string().valid('pending', 'accepted', 'rejected'),
    sortBy: Joi.string(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required()
  })
});

// Joi schema for creating a request status
const createReqStatusSchema = Joi.object({
  body: Joi.object({
    status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
    mentorEmail: Joi.string().required(),
    menteeEmail: Joi.string().required(),
    requestId: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    day: Joi.string().required(),
    menteeName: Joi.string().required(),
    mentorName: Joi.string().required(),
    message: Joi.string()
  })
});

// Joi schema for deleting a request status
const deleteReqStatusSchema = Joi.object({
  params: Joi.object({
    reqStatusId: Joi.string().alphanum().min(24).max(24).required()
  })
});

// Joi schema for getting a single request status by ID
const getReqStatusByIdSchema = Joi.object({
  params: Joi.object({
    reqStatusId: Joi.string().alphanum().min(24).max(24).required()
  })
});

module.exports = {
  createRequestSchema,
  deleteRequestSchema,
  getRequestByIdSchema,
  getAllRequestsByMentorIdSchema,
  getAllRequestsByMenteeIdSchema,
  createReqStatusSchema,
  deleteReqStatusSchema,
  getReqStatusByIdSchema
};

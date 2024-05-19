const Joi = require('joi');
const { languages } = require('../general/enums');
// Joi schema for creating a request
const createRequestSchema = Joi.object({
  body: Joi.object({
    day: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    mentorId: Joi.string().required(),
    menteeId: Joi.string().required(),
    date: Joi.date().required(),
    requestType: Joi.string().valid('oneToOne', 'package').required(),
    package: Joi.object({
      noOfdays: Joi.number().required(),
      amount: Joi.number().required(),
      time: Joi.string().required()
    }),
    email: Joi.string(),
    topic: Joi.string(),
    description: Joi.string().max(500).min(10),
    language: Joi.string().valid(...Object.values(languages)).default(languages.ENGLISH),
    name: Joi.string(),
  })
});

const getAllRequests = Joi.object({
  query: Joi.object({
    sortBy: Joi.string(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
    menteeId: Joi.string(),
    mentorId: Joi.string(),
    requestType: Joi.string().valid('oneToOne', 'package')
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
    sortBy: Joi.string(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required()
  })
});

// Joi schema for getting all requests by mentee ID
const getAllRequestsByMenteeIdSchema = Joi.object({
  params: Joi.object({
    menteeId: Joi.string().required()   
  }),
  query: Joi.object({
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
    message: Joi.string(),
    mentorId: Joi.string().required(),
    menteeId: Joi.string().required(),
  })
});

// Joi schema for deleting a request status
const deleteReqStatusSchema = Joi.object({
  params: Joi.object({
    reqStatusId: Joi.string().alphanum().min(24).max(24).required()
  })
});

const getAllReqStatusesByMenteeIdSchema = Joi.object({
  params: Joi.object({
    menteeId: Joi.string().required()   
  }),
  query: Joi.object({
    sortBy: Joi.string(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
    status: Joi.string().valid('pending', 'accepted', 'rejected')
  })
})
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
  getReqStatusByIdSchema,
  getAllReqStatusesByMenteeIdSchema,
  getAllRequests
};

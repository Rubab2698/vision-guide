const Joi = require('joi');
const { languages ,reqStatuses} = require('../general/enums');
// Joi schema for creating a request
const createRequestSchema = Joi.object({
  body: Joi.object({
    day: Joi.string(),
    startTime: Joi.string(),
    endTime: Joi.string(),
    mentorId: Joi.string(),
    menteeId: Joi.string(),
    date: Joi.date(),
    requestType: Joi.string().valid('oneToOne', 'package').required(),
    package: Joi.object({
      packageTime: Joi.array().items(Joi.object({
        day: Joi.string(),
        startTime: Joi.string(),
        endTime: Joi.string(),
      })),
    }),
    email: Joi.string(),
    topic: Joi.string(),
    description: Joi.string().max(500).min(10),
    language: Joi.string().valid(...Object.values(languages)).default(languages.ENGLISH),
    name: Joi.string(),
    serviceId:Joi.string().required()
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
    requestType: Joi.string().valid('oneToOne', 'package','chat'),
    status: Joi.string().valid(...Object.values(reqStatuses)),
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
    requestType: Joi.string().valid('oneToOne', 'package','chat'),
    status: Joi.string().valid(...Object.values(reqStatuses)),
    sortBy: Joi.string(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required()
  })
});

// Joi schema for creating a request status
const createReqStatusSchema = Joi.object({
  params: Joi.object({ 
    reqStatusId: Joi.string().alphanum().min(24).max(24).required()
   }),
  body: Joi.object({
    status: Joi.string().valid(...Object.values(reqStatuses)).required(),
    reqId: Joi.string().required(),
    message: Joi.string(),
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
    status: Joi.string().valid(...Object.values(reqStatuses)),
    requestType: Joi.string().valid('oneToOne', 'package','chat'),

  })
})

const getAllReqStatusesByMentorIdSchema = Joi.object({
  params: Joi.object({
    mentorId: Joi.string().required()   
  }),
  query: Joi.object({
    sortBy: Joi.string(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
    status: Joi.string().valid(...Object.values(reqStatuses)),
    requestType: Joi.string().valid('oneToOne', 'package','chat'),
  })
})
// Joi schema for getting a single request status by ID
const getReqStatusByIdSchema = Joi.object({
  params: Joi.object({
    reqStatusId: Joi.string().alphanum().min(24).max(24).required()
  })
});


const getReqStatusByRequestId = Joi.object({
  params: Joi.object({
    reqId: Joi.string().alphanum().min(24).max(24).required()
  })
})

const cancelMeeting = Joi.object({
  params: Joi.object({
    eventId: Joi.string()
  })
})

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
  getAllReqStatusesByMentorIdSchema,
  getAllRequests,
  getReqStatusByRequestId,
  cancelMeeting
};

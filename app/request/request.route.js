const express = require('express');
const router = express.Router();
const controller = require('./request.controller');
const { verifyAccessToken, authorizationMiddleware } = require('../authToken/auth.serivce');
const { validateSchema } = require('../general/joiValidation');
const {
  createRequestSchema,
  deleteRequestSchema,
  getRequestByIdSchema,
  getAllRequestsByMentorIdSchema,
  getAllRequestsByMenteeIdSchema,
  createReqStatusSchema,
  deleteReqStatusSchema,
  getReqStatusByIdSchema,
  getAllReqStatusesByMenteeIdSchema

} = require('./request.joi.schema');

// Create a new request
router.post(
  '/',
  verifyAccessToken,
  authorizationMiddleware('Mentee', 'Admin'),
  validateSchema(createRequestSchema),
  controller.postCreateRequest
);

// Get all requests
router.get(
  '/',
  verifyAccessToken,
  authorizationMiddleware('Mentee', 'Admin', 'Mentor'),
  controller.getAllRequestsWithFilters
);

// Get a single request by ID
router.get(
  '/:requestId',
  validateSchema(getRequestByIdSchema),
  controller.getSingleRequestById
);

// Delete a request by ID
router.delete(
  '/:requestId',
  verifyAccessToken,
  authorizationMiddleware('Mentee', 'Admin'),
  validateSchema(deleteRequestSchema),
  controller.deleteSingleRequest
);

// Get all requests by mentor ID
router.get(
  '/mentor/:mentorId',
  verifyAccessToken,
  authorizationMiddleware( ['Admin', 'Mentor']),
  validateSchema(getAllRequestsByMentorIdSchema),
  controller.getAllRequestsByMentor
);

// Get all requests by mentee ID
router.get(
  '/mentee/:menteeId',
  verifyAccessToken,
  authorizationMiddleware( ['Admin', 'Mentee']),
  validateSchema(getAllRequestsByMenteeIdSchema),
  controller.getAllRequestsByMentee
);

// Create a new request status
router.post(
  '/status',
  verifyAccessToken,
  authorizationMiddleware('Mentor', 'Admin'),
  validateSchema(createReqStatusSchema),
  controller.postCreateReqStatus
);


// Get all request statuses
router.get(
    '/allstatus/statuses',
    verifyAccessToken,
    authorizationMiddleware('Admin'),
    controller.getAllReqStatusesController
  );
  
  // Get a single request status by ID
  router.get(
    '/status/:reqStatusId',
    verifyAccessToken,
    authorizationMiddleware(['Admin', 'Mentor']),
    validateSchema(getReqStatusByIdSchema),
    controller.getSingleReqStatusById
  );
  
  // Delete a request status by ID
  router.delete(
    '/status/:reqStatusId',
    verifyAccessToken,
    authorizationMiddleware(['Admin', 'Mentor']),
    validateSchema(deleteReqStatusSchema),
    controller.deleteSingleReqStatus
  );
  
  router.get(
    '/status/mentee/:menteeId',
    verifyAccessToken,
    authorizationMiddleware(['Admin', 'Mentee']),
    validateSchema(getAllReqStatusesByMenteeIdSchema),
    controller.getAllReqStatusesByMentee
  );
  module.exports = router;
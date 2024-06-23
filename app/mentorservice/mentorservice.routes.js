const express = require('express');
const router = express.Router();
const controller = require('./mentorservice.controller');
const { verifyAccessToken, authorizationMiddleware } = require('../authToken/auth.serivce');
const { validateSchema } = require('../general/joiValidation');
const { createPackageSchema,createBasicServiceSchema, updateBasicServiceSchema,idSchema, getAllBasicServiceSchema } = require('./mentorservice.joi.schema');
const { createPackage } = require('./mentorservice.service');

// Create a new basic service
router.post(
  '/',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin']),
  validateSchema(createBasicServiceSchema),
  controller.createBasicService
);

router.post(
  '/package',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin']),
  validateSchema(createPackageSchema),
  controller.createPackage
)
// Update an existing basic service
router.patch(
  '/:serviceId',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin']),
  validateSchema(updateBasicServiceSchema),
  controller.updateBasicService
);
router.get('/:serviceId', 
verifyAccessToken, 
authorizationMiddleware(['Mentor', 'Admin','Mentee']),
validateSchema(idSchema),
 controller.getBasicServiceById);
// Delete a basic service by ID
router.delete(
  '/:serviceId',
  verifyAccessToken,
  authorizationMiddleware(['Mentor', 'Admin']),
  validateSchema(idSchema),
  controller.deleteBasicService
);

// Get all basic services
router.get(
  '/',
  validateSchema(getAllBasicServiceSchema),
  controller.getAllBasicService
);

module.exports = router;

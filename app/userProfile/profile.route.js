const express = require('express');
const router = express.Router();
const controller= require('./profile.controller');

const { uploadToS3 } = require('../general/multer.s3');
const { verifyAccessToken, authorizationMiddleware } = require('../authToken/auth.serivce');
const { validateSchema } = require('../general/joiValidation');
const { menteeProfileSchema, mentorProfileSchema,idSchema ,menteeUpdate,getAllProfilesSchema} = require('./profile.joi.schema');

// Create a new mentor profile
router.post(
  '/mentor',
  verifyAccessToken,
  authorizationMiddleware('Mentor'),
  validateSchema(mentorProfileSchema),
  // uploadToS3.fields([
  //   { name: 'profilepic', maxCount: 1 },
  //   { name: 'introvideo', maxCount: 1 }
  // ]),
  controller.createProfilerMentor
);

// Update an existing mentor profile
router.patch(
  '/mentor/:profileId',
  verifyAccessToken,
  authorizationMiddleware('Mentor'),
  validateSchema(mentorProfileSchema),
  uploadToS3.fields([
    { name: 'profilepic', maxCount: 1 },
    { name: 'introvideo', maxCount: 1 }
  ]),
  controller.updateProfileMentor
);

// Get a specific mentor profile by ID
router.get(
  '/:profileId',
  verifyAccessToken,
  validateSchema(idSchema),
  controller.getProfileById

);

// Get all mentor profiles
router.get('/', validateSchema(getAllProfilesSchema), controller.getAllProfiles);

// Delete a  profile by ID
router.delete(
  '/:profileId/mentee',  verifyAccessToken,  validateSchema(idSchema),controller.deleteProfileByIdMentee
)
router.delete(
  '/:profileId/mentor',  verifyAccessToken,  validateSchema(idSchema),controller.deleteProfileByIdMentor
)

// Create a new mentee profile
router.post(
  '/mentee',
  verifyAccessToken,
  authorizationMiddleware('Mentee'),
  validateSchema(menteeProfileSchema),
  uploadToS3.fields([
    { name: 'profilepic', maxCount: 1 }
  ]),
  controller.createProfileMentee
);

// Update an existing mentee profile
router.patch(
  '/mentee/:profileId',
  verifyAccessToken,
  authorizationMiddleware('Mentee'),
  validateSchema(menteeUpdate),
  uploadToS3.fields([
    { name: 'profilepic', maxCount: 1 }
  ]),
  controller.updateProfileMentee
);


module.exports = router;

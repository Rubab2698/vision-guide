const express = require('express')
const app = express();
const authRouter = express.Router();
const authController = require('./user.controller');
app.use(express.json());
const schema = require('./user.joi.schema')
const { validateSchema } = require('../general/joiValidation')

// //protected route
// authRouter.get('/protected', authenticateJwt, (req, res, next) => {
//   res.send('Hello from me.')
// })
//route for handling register post req
// authRouter.post('/register', validateSchema(schema._register), authController.postRegister);
//login with google and facebook
// authRouter.get('/login/google', authenticateGoogle)
// authRouter.get("/google", function (req, res) {
//   res.send('Login with Google successfull!');
// })
// authRouter.get('/failure', (req, res) => {
//   res.send("Login with Google failed!!!");
// })
// authRouter.get('/login/facebook', authenticateFacebook)

// authRouter.get('/facebook', (req, res) => {
//   res.send("login with facebook");
// })
//route for handling login post req

// authRouter.post('/signup/user',validateSchema(schema.signUpEmailSchema), async (req, res, next) => {
//   try {
//     authController.postRegisterEmail(req, res,next);
//   } catch (error) {
//     next(error);
//   }
// })
// authRouter.post('/login/user', validateSchema(schema.loginSchema), async (req, res, next) => {
//   try {
//     authController.postLogin(req, res,next);
//   } catch (error) {
//     next(error);
//   }
// })

// authRouter.post('/signup/google/admin',validateSchema(schema.signUpGoogleSchema), async (req, res, next) => {
//   try {
//     authController.postRegisterGoogleAdmin(req, res,next);
//   } catch (error) {
//     next(error);
//   }
// })
// authRouter.post('/login/admin',validateSchema(schema.loginSchema), async (req, res, next) => {
//   try {
//     authController.postLoginadmin(req, res,next);
//   } catch (error) {
//     next(error);
//   }
// })
// authRouter.post('/signup/linkedin', async (req, res, next) => {
//   try {
//     // Use the `valid` middleware here
//     // If validation succeeds, proceed to the authController
//     authController.postRegisterGoogleLinkedin(req, res,next);
//   } catch (error) {
//     next(error);
//   }
// })

//route for handling refresh token post req
// authRouter.post('/refreshToken', authenticateJwt, authController.postRefreshToken)
//route for handling logout post req



authRouter.post('/user/signup/google',validateSchema(schema.signUpGoogleSchema), async (req, res, next) => {
  try {
    authController.postRegisterGoogle(req, res,next);
  } catch (error) {
    next(error);
  }
})
authRouter.post('/user/signup/phone',validateSchema(schema.signUpGoogleSchema), async (req, res, next) => {
  try {
    authController.postRegisterGoogle(req, res,next);
  } catch (error) {
    next(error);
  }
})
authRouter.post('/admin/signup',validateSchema(schema.signUpEmailSchema), async (req, res, next) => {
  try {
    authController.postRegisterEmailAdmin(req, res,next);
  } catch (error) {
    next(error);
  }
})


authRouter.delete('/logout/:userId',validateSchema(schema.logoutSchema), authController.postLogOut)

authRouter.post('/refreshtoken',authController.postRefreshToken)
module.exports = authRouter;
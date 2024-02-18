const express = require('express')
const app = express();
const authRouter = express.Router();
const authController = require('./user.controller');
app.use(express.json());
const schema = require('./user.joi.schema')
const { validateSchema } = require('../general/joiValidation')
const {verifyAccessToken} = require('../authToken/auth.serivce')
const {authorizationMiddleware} = require('../authToken/auth.serivce')

//customer routes
authRouter.post('/login', validateSchema(schema.loginSchema), authController.postLogin)
authRouter.post('/register', validateSchema(schema._register), authController.postRegisterEmail)
authRouter.post('/signup/google',validateSchema(schema.signUpGoogleSchema),authController.postRegisterGoogle)
authRouter.post('/signup/phone',validateSchema(schema.signUpPhoneSchema),authController.postLoginPhone)
//admin routes
// authRouter.post('/admin/signup',validateSchema(schema.signUpEmailSchema),  authController.postRegisterEmailAdmin)
authRouter.post('/admin/login',validateSchema(schema.loginSchema),  authController.postLoginadmin)
authRouter.get('/refreshtoken',validateSchema(schema.refreshTokenSchema),authController.postRefreshToken)

//user crud only admin
authRouter.get('/', authController.getAllUsers);
authRouter.route('/:id')
.get(validateSchema(schema.idSchema),  authController.getUserById)
.patch( verifyAccessToken,authorizationMiddleware('admin'),validateSchema(schema.updateUserSchema),authController.updateUser)
.delete(verifyAccessToken,authorizationMiddleware('admin'),validateSchema(schema.idSchema),authController.deleteUser)
module.exports = authRouter;








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
// authRouter.post('/signup/google/admin',validateSchema(schema.signUpGoogleSchema), async (req, res, next) => {
//   try {
//     authController.postRegisterGoogleAdmin(req, res,next);
//   } catch (error) {
//     next(error);
//   }
// })
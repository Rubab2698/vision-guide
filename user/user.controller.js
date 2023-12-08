
const authService = require('./user.service');

const postRegisterEmail = async (req, res, next) => {
  try {
    const result = await authService.signUpByEmail(req, res, next);

    const { newAccessToken, newRefreshToken,newUser } = result;
    const { email } = result;

    res.status(200).json({
      message: "Successfully Registered",
      info: `Registered with: ${email}`,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user:newUser
    });
  } catch (error) {
    next(error);
  }
};
const postRegisterEmailAdmin = async (req, res, next) => {
  try {
    const result = await authService.signUpByEmailAdmin(req, res, next);

    const { newAccessToken, newRefreshToken ,newUser} = result;
    const { email } = result;

    res.status(200).json({
      message: "Successfully Registered",
      info: `Registered with: ${email}`,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user:newUser
    });
  } catch (error) {
    next(error);
  }
};
const postRegisterGoogle = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await authService.signUpByGoogle(req, res, next);

    const { newAccessToken, newRefreshToken,user } = result;
    const { email } = req.body;

    res.status(200).json({
      message: "Successfully Registered",
      info: `Registered with: ${email}`,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user:user
    });
  } catch (error) {
    next(error);
  }
};
const postRegisterGoogleAdmin = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await authService.signUpByGoogleAdmin(req, res, next);
    console.log(result)
    const { newAccessToken, newRefreshToken ,user} = result;
    const { email } = req.body;

    res.status(200).json({
      message: "Successfully Registered",
      info: `Registered with: ${email}`,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user:user
    });
  } catch (error) {
    next(error);
  }
};
const postLogin = async (req, res, next) => {
  await authService.login(req, res, next)
    .then(result => {
      var { accessToken, refreshToken, user } = result;

      delete user.password;
      res.send({ message: "Login SuccessFull", accessToken, refreshToken, user })
    })
    .catch(error => { next(error) })


}
const postLoginadmin = async (req, res, next) => {
  await authService.loginAdmin(req, res, next)
    .then(result => {
      var { accessToken, refreshToken, user } = result;

      delete user.password;
      res.send({ message: "Login SuccessFull", accessToken, refreshToken, user })
    })
    .catch(error => { next(error) })


}
const postLogOut = async (req, res, next) => {
  const { userId } = req.params
  const result = await authService.logOut(userId);
  console.log(result)
  res.send(result)

}
const postRefreshToken = async (req, res, next) => {
  try {
    const result = await authService.verifyRefreshToken(req.body.refreshToken);
    // If verification is successful, return a new access token
    res.status(200).json(result);
  } catch (error) {
    // Handle errors appropriately
    res.status(401).json({ error: 'Unauthorized', message: error.message });
  }
};

module.exports = {
  postLogOut,
  postRefreshToken,
  postLogin,
  postRegisterEmail,
  postRegisterGoogle,
  postLoginadmin,
  postRegisterEmailAdmin,
  postRegisterGoogleAdmin


}
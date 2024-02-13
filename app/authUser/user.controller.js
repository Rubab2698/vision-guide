
const authService = require('./user.service');
const pick = require("../general/pick")
const axios = require("axios")



//login signup section
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
// const postRegisterGoogleAdmin = async (req, res, next) => {
//   try {
//     console.log(req.body);
//     const result = await authService.signUpByGoogleAdmin(req, res, next);
//     console.log(result)
//     const { newAccessToken, newRefreshToken ,user} = result;
//     const { email } = req.body;

//     res.status(200).json({
//       message: "Successfully Registered",
//       info: `Registered with: ${email}`,
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken,
//       user:user
//     });
//   } catch (error) {
//     next(error);
//   }
// };
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
const postRegisterEmailAdmin = async (req, res, next) => {
  try {
    const result = await authService.signUpByEmailAdmin(req, res, next);

    const { newAccessToken, newRefreshToken, newUser } = result;
    const { email } = result;

    res.status(200).json({
      message: "Successfully Registered",
      info: `Registered with: ${email}`,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};
const postRegisterGoogle = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await authService.signUpByGoogle(req, res, next);

    const { newAccessToken, newRefreshToken, user } = result;

    res.status(200).json({
      message: "Successfully Registered",
      info: `Registered with: ${user.email}`,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: user
    });
  } catch (error) {
    next(error);
  }
};
const postLoginPhone = async (req, res, next) => {
  try {
    const result = await authService.signUpByPhoneNumber(req.body.token);

    res.status(200).json({
      message: "Successfully Registered",
      result: result
    });
  } catch (error) {
    next(error);
  }
};
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
//user crud section
const getAllUsers = async (req, res) => {
  const filters = pick(req.query, ["category"]);
  const options = pick(req.query, ["sortBy", "page", "limit"]);
  const searchKeyword = pick(req.query, ["search"]);

  try {

    const result = await authService.getAllUsers({
      filters,
      searchKeyword,
      options,
    });
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
const getUserById = async (req, res) => {
  try {
    const user = await authService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
}
const updateUser = async (req, res) => {
  try {
    const user = await authService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
}
const deleteUser = async (req, res) => {
  try {
    const user = await authService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {

  postRefreshToken,
  postLogin,
  postRegisterEmail,
  postRegisterGoogle,
  postLoginadmin,
  postRegisterEmailAdmin,
  // postRegisterGoogleAdmin
  postLoginPhone,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById

}
const { User } = require('./user.model')
const { Token } = require('../authUser/auth.model')
const createError = require('http-errors')
const authJwt = require('../authUser/auth.serivce')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

async function isValidPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}
const saveTokensToDB = async (userId, refreshToken) => {
    // Calculate the expiration time for the token, e.g., 1 year from the current time
    const expireTime = new Date();
    expireTime.setFullYear(expireTime.getFullYear() + 1);

    const tokenDoc = new Token({ userId, refreshToken, expireTime });
    const result = await tokenDoc.save();
    console.log(result);
};
const verifyRefreshToken = async function (refreshToken) {
    try {
        // Decode the refresh token to get the user ID
        console.log(refreshToken)
        const payload = jwt.decode(refreshToken);
        console.log(payload)
        // Find a user with the matching user ID and refresh token
        const user = await Token.findOne({ userId: payload.sub, refreshToken: refreshToken });

        if (user) {
            const newAccessToken = await authJwt.signAccessToken(user);
            return { user, newAccessToken };
        } else {
            throw new Error('No matching user found');
        }
    } catch (error) {
        // Handle errors (e.g., token verification failed)
        console.error('Error while verifying refresh token:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};
const login = async (req, res, next) => {
    try {
        const result = req.body;
        const user = await User.findOne({ email: result.email });
        if (!user) throw createError.NotFound('User not registered');

        const isMatch = await isValidPassword(result.password, user.password);
        if (!isMatch)
            throw createError.Unauthorized('Username/password not valid');

        const userId = user._id;
        console.log(userId)
        const accessToken = await authJwt.signAccessToken(user);
        const refreshToken = await authJwt.signRefreshToken(user);
        saveTokensToDB(userId, refreshToken);

        return { accessToken, refreshToken, user: { ...user._doc } };
    } catch (error) {
        if (error.isJoi === true)
            return next(createError.BadRequest('Invalid Username/Password'));
        throw error;
    }
};
const loginAdmin = async (req, res, next) => {
    try {
        const result = req.body;
        const user = await User.findOne({ email: result.email });
        if (!user) throw createError.NotFound('User not registered');

        const isMatch = await isValidPassword(result.password, user.password);
        if (!isMatch)
            throw createError.Unauthorized('Username/password not valid');

        const userId = user._id;
        const accessToken = await authJwt.signAccessToken(user);
        const refreshToken = await authJwt.signRefreshToken(user);



        saveTokensToDB(userId, refreshToken);

        return { accessToken, refreshToken, user: { ...user._doc } };
    } catch (error) {
        if (error.isJoi === true)
            return next(createError.BadRequest('Invalid Username/Password'));
        throw error;
    }
};
const signUpByEmail = async (req, res) => {
    try {
        const { email, userName, profilePicture, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createError.Conflict('User with this email already exists.');
        } else {
            const newUser = new User({
                email,
                userName,
                profilePicture,
                password,
            });
            const newAccessToken = await authJwt.signAccessToken(newUser);
            const newRefreshToken = await authJwt.signRefreshToken(newUser);
            newUser.refreshToken = newRefreshToken
            await newUser.save();
            await saveTokensToDB(newUser._id, newRefreshToken);
            return { newUser, newAccessToken, newRefreshToken };
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};
const signUpByEmailAdmin = async (req, res) => {
    try {
        const { email, userName, profilePicture, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createError.Conflict('User with this email already exists.');
        } else {

            const newUser = new User({
                email,
                userName,
                profilePicture,
                password,
                role: 'admin'
            });
            const newAccessToken = await authJwt.signAccessToken(newUser);
            const newRefreshToken = await authJwt.signRefreshToken(newUser);
            newUser.refreshToken = newRefreshToken
            await newUser.save();
            await saveTokensToDB(newUser._id, newRefreshToken);
            return { newUser, newAccessToken, newRefreshToken };
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};
const signUpByGoogle = async (req, res, next) => {
    try {
        console.log(req.body);
        const { email, userName, profilePicture, accessToken } = req.body;
        const decodedToken = jwt.decode(accessToken);
        console.log(decodedToken);
        const googleValues = decodedToken.firebase.identities['google.com'];
        console.log('Values from google.com:', googleValues);
        const googleId = googleValues[0];
        const query = { googleId: googleId };
        let user;

        const existingUser = await User.findOne({ $or: [{ email }, query] });

        if (existingUser) {
            existingUser.userName = userName;
            existingUser.profilePicture = profilePicture;
            existingUser.email = email;
            await existingUser.save();
            user = existingUser;
        } else {
            user = new User({
                googleId: googleId,
                email,
                userName,
                profilePicture,
            });
            user.platform = 'google';
            await user.save();
        }
        console.log(user);
        const newAccessToken = await authJwt.signAccessToken(user);
        const newRefreshToken = await authJwt.signRefreshToken(user);
        user.refreshToken = newRefreshToken;
        await saveTokensToDB(user._id, newRefreshToken);
        return { user, newAccessToken, newRefreshToken };
    } catch (error) {
        console.error(error);
        throw error;
    }
};
const signUpByGoogleAdmin = async (req, res, next) => {
    try {
        console.log(req.body);
        const { email, userName, profilePicture, accessToken } = req.body;
        const decodedToken = jwt.decode(accessToken);
        console.log(decodedToken);
        const googleValues = decodedToken.firebase.identities['google.com'];
        console.log('Values from google.com:', googleValues);
        const googleId = googleValues[0];
        const query = { googleId: googleId };
        let user;

        const existingUser = await User.findOne({ $or: [{ email }, query] });

        if (existingUser) {
            existingUser.userName = userName;
            existingUser.profilePicture = profilePicture;
            existingUser.email = email;
            await existingUser.save();
            user = existingUser;
        } else {
            user = new User({
                googleId: googleId,
                email,
                userName,
                profilePicture,
            });
            user.platform = 'google';
            user.role = 'admin';
        }

        const newAccessToken = await authJwt.signAccessToken(user);
        const newRefreshToken = await authJwt.signRefreshToken(user);
        user.refreshToken = newRefreshToken;
        await saveTokensToDB(user._id, newRefreshToken);
        await user.save();
        return { user, newAccessToken, newRefreshToken };


    } catch (error) {
        console.error(error);
        throw error;
    }
};
const logOut = async (userId) => {
    try {
        // Find the access token associated with the given userId and mark it as revoked
        const result = await Token.findOneAndUpdate(
            { userId },
            { revoked: true }
        );

        // Check if an access token was found and revoked
        if (result) {
            console.log(`Access token revoked for user ID: ${userId}`);
            return userId;
        } else {
            console.log(`No access token found for user ID: ${userId}`);
            return null; // No access token found for the user
        }
    } catch (error) {
        throw error;
    }
};
// {
// // const user = await User.findOne({ _id: userId })
// //  console.log(user._doc)
// // const registerGooglelinkdedin= async (req, res) => {
// //     try {
// //       const { platform, uniqueId, email, userName, profilePicture, accessToken, idToken, refreshToken } = req.body;

// //       // Construct the query based on the platform (Google or LinkedIn)
// //       const query = platform === 'google' ? { googleId: uniqueId } : { linkedinId: uniqueId };

// //       const existingUser = await User.findOne({ $or: [{ email }, query ]});

// //       if (existingUser) {
// //         existingUser.userName = userName;
// //         existingUser.profilePicture = profilePicture;
// //         existingUser.accessToken = accessToken;
// //           if (idToken) {
// //           existingUser.idToken = idToken;
// //         }
// //         if (refreshToken) {
// //           existingUser.refreshToken = refreshToken;
// //         }
// //         await existingUser.save();
// //         res.json(existingUser);
// //       } else {
// //         const newUser = new User({
// //           _id: uniqueId,
// //           email,
// //           userName,
// //           profilePicture,
// //           accessToken,
// //           ...(idToken && { idToken }),
// //           ...(refreshToken && { refreshToken }),
// //         });
// //         newUser.platform = platform;

// //         await newUser.save();
// //         return newUser
// //       }
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   }; 



// }
module.exports = {
    logOut,
    login,
    signUpByEmail,
    signUpByGoogle,
    loginAdmin,
    signUpByEmailAdmin,
    signUpByGoogleAdmin,
    verifyRefreshToken
}
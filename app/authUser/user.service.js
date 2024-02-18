const { User } = require('./user.model')
const { Token } = require('../authToken/auth.model')
const createError = require('http-errors')
const authJwt = require('../authToken/auth.serivce')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
require("dotenv").config();
const axios = require('axios');
const { platform } = require('../general/enums')


const googleVerification = async (token) => {
    try {
        const data = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        if (data && data.statusText == 'OK' && data.data)
            console.log(data)
        console.log(data.data)

        return data.data;
    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        throw new Error('INVALID_TOKEN');
    }

}
// const googleVerification = async (req) => {
//     try {
//         const token = req.body.token; // Adjust this based on the actual structure of your request body

//         const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         if (response && response.statusText === 'OK' && response.data) {
//             console.log(response.data);
//             return response.data;
//         } else {
//             throw new Error('Invalid response from Google API');
//         }
//     } catch (err) {
//         console.error(err.response ? err.response.data : err.message);
//         throw new Error('INVALID_TOKEN');
//     }
// };

let firebaseVerifTok = async (token) => {

    let firebaseApp = null;
    var admin = require("firebase-admin");
    var serviceAcount = require("../general/firebaseadmin.json");
    const app = !admin.apps.length ? admin.initializeApp({ credential: admin.credential.cert(serviceAcount) }) : admin.app();

    // const { getAuth } = require("firebase-admin/auth")
    let getauth = admin.auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            return decodedToken.phone_number;
        })
        .catch((error) => {
            console.log(error)
            throw error
        });

    return getauth;
}
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
        const user = await User.findOne({ email: result.email});
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
const signUpByPhoneNumber = async (token) => {
    try {

        const phoneNumber = await firebaseVerifTok(token)


        // Find or create the user with this phone number
        let user = await User.findOneAndUpdate(
            { phoneNumber: phoneNumber },
            { $setOnInsert: { phoneNumber: phoneNumber } },
            { new: true, upsert: true, projection: { email: 0 } }
        );


        const newAccessToken = await authJwt.signAccessToken(user);
        const newRefreshToken = await authJwt.signRefreshToken(user);

        // Return user and tokens
        return { user, newAccessToken, newRefreshToken };

    } catch (error) {
        console.error(error);
        throw error;
    }
};
const signUpByGoogle = async (req, res, next) => {
    try {
        console.log(req.body);
        const { token } = req.body;
        const data = await googleVerification(token)

        if (data) {

            const googleId = data.sub;
            const query = { googleId: googleId };
            let user;

            // Check if the user already exists
            const existingUser = await User.findOne({ query });

            if (existingUser) {
                // Update existing user information
                existingUser.userName = data.name;
                existingUser.email = data.email;
                user = await existingUser.save();

            } else {
                // Create a new user
                user = new User({
                    googleId: googleId,
                    email: data.email,
                    userName: data.name,
                });
                user.platform = 'google';
                await user.save();
            }

            // Generate new access and refresh tokens
            const newAccessToken = await authJwt.signAccessToken(user);
            const newRefreshToken = await authJwt.signRefreshToken(user);

            // Update the user with the new refresh token
            user.refreshToken = newRefreshToken;
            await saveTokensToDB(user._id, newRefreshToken);

            // Return user and tokens
            return { user, newAccessToken, newRefreshToken };
        } else {
            // Token is not valid
            throw new Error('Token not valid')
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};
//crud 
const getAllUsers = async function ({ filters, searchKeyword, options }) {
    try {
        const { sortBy, page, limit } = options;

        // Pipeline for search, filtering, sorting, and pagination
        const mainPipeline = [];

        // Atlas search stage
        if (searchKeyword.search && searchKeyword.search !== undefined) {
            const findKeyword = {
                index: "user_atlas_search",
                text: {
                    query: searchKeyword.search,
                    path: {
                        wildcard: "*",
                    },
                },
            };
            mainPipeline.push({ $search: findKeyword });
        }

        mainPipeline.push({ $match: filters });

        // Add additional lookup stages if needed

        const projectStage = {
            $project: {
                'password': 0, // Exclude password field from the result
            },
        };
        mainPipeline.push(projectStage);

        if (options && options.sortBy) {
            const parsedSortBy = JSON.parse(sortBy);
            mainPipeline.push({ $sort: parsedSortBy });
        } else {
            mainPipeline.push({ $sort: { createdAt: -1 } });
        }

        // Pagination stages
        mainPipeline.push({ $skip: (page - 1) * limit });
        mainPipeline.push({ $limit: parseInt(limit) });

        // Execute the main pipeline
        const results = await User.aggregate(mainPipeline);

        // Pipeline for counting total documents
        const countPipeline = [
            { $count: 'totalDocuments' },
        ];

        // Execute the count pipeline
        const countResults = await User.aggregate(countPipeline);

        const totalDocuments = countResults.length > 0 ? countResults[0].totalDocuments : 0;
        const totalPages = Math.ceil(totalDocuments / limit);

        // Return the response
        const response = {
            results,
            pagination: {
                totalPages,
                currentPage: parseInt(page),
                totalDocuments,
                docsOnPage: results.length,
            },
        };

        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
const getUserById = async function (userId) {
    try {
        const user = await User.findById(userId).select('-password');
        return user;
    } catch (error) {
        throw error;
    }
}
const updateUser = async function (userId, userData) {
    try {
        const user = await User.findByIdAndUpdate(userId, userData, { new: true }).select('-password');
        return user;
    } catch (error) {
        throw error;
    }
}
const deleteUser = async function (userId) {
    try {
        const user = await User.findByIdAndDelete(userId).select('-password');
        return user;
    } catch (error) {
        throw error;
    }
}
const signUpByEmail = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createError.Conflict('User with this email already exists.');
        } else {
            const newUser = new User({
                email,
                role,
                password,
                platform: platform.email
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




module.exports = {

    login,
    signUpByEmail,
    signUpByGoogle,
    loginAdmin,
    signUpByEmailAdmin,
    // signUpByGoogleAdmin,
    verifyRefreshToken,
    signUpByPhoneNumber,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}





// const signUpByGoogleAdmin = async (req, res, next) => {
//     try {
//         console.log(req.body);
//         const { email, userName, profilePicture, accessToken } = req.body;
//         const decodedToken = jwt.decode(accessToken);
//         console.log(decodedToken);
//         const googleValues = decodedToken.firebase.identities['google.com'];
//         console.log('Values from google.com:', googleValues);
//         const googleId = googleValues[0];
//         const query = { googleId: googleId };
//         let user;

//         const existingUser = await User.findOne({ $or: [{ email }, query] });

//         if (existingUser) {
//             existingUser.userName = userName;
//             existingUser.profilePicture = profilePicture;
//             existingUser.email = email;
//             await existingUser.save();
//             user = existingUser;
//         } else {
//             user = new User({
//                 googleId: googleId,
//                 email,
//                 userName,
//                 profilePicture,
//             });
//             user.platform = 'google';
//             user.role = 'admin';
//         }

//         const newAccessToken = await authJwt.signAccessToken(user);
//         const newRefreshToken = await authJwt.signRefreshToken(user);
//         user.refreshToken = newRefreshToken;
//         await saveTokensToDB(user._id, newRefreshToken);
//         await user.save();
//         return { user, newAccessToken, newRefreshToken };


//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

// const signUpByGoogle = async (req, res, next) => {
//     try {

//         console.log(req.body);
//         const { userName, profilePicture, accessToken } = req.body;
//         const response = await axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo', {
//             params: {
//                 id_token: accessToken,
//             },
//         });

//         // Check the response for necessary information
//         const { aud, email, iss } = response.data;

//         // Validate the audience, email, and issuer as needed
//         if (aud === process.env.GOOGLE_CLIENT_ID && email) {
//             // Token is valid, and you can proceed with user authentication
//             const decodedToken = jwt.decode(accessToken);
//             console.log(decodedToken);
//             const googleValues = decodedToken.firebase.identities['google.com'];
//             console.log('Values from google.com:', googleValues);
//             const googleId = googleValues[0];
//             const query = { googleId: googleId };
//             let user;

//             const existingUser = await User.findOne({ $or: [{ email }, query] });

//             if (existingUser) {
//                 existingUser.userName = userName;
//                 existingUser.profilePicture = profilePicture;
//                 existingUser.email = req.body.email;
//                 await existingUser.save();
//                 user = existingUser;
//             } else {
//                 user = new User({
//                     googleId: googleId,
//                     email: req.body.email,
//                     userName,
//                     profilePicture,
//                 });
//                 user.platform = 'google';
//                 await user.save();
//             }
//             console.log(user);
//             const newAccessToken = await authJwt.signAccessToken(user);
//             const newRefreshToken = await authJwt.signRefreshToken(user);
//             user.refreshToken = newRefreshToken;
//             await saveTokensToDB(user._id, newRefreshToken);
//             return { user, newAccessToken, newRefreshToken };
//         } else {
//             // Token is not valid
//             return false;
//         }



//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };




/*// /
/ const user = await User.findOne({ _id: userId })
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



// }*/
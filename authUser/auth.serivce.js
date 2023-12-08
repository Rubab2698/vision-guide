const Jwt = require('jsonwebtoken')
const createError = require('http-errors')
require('dotenv').config();

const signAccessToken = async function (user) {
    try {
        return new Promise((res, rej) => {
            const payload = {
                sub: user.id,       // User ID
                email: user.email,
                role: user.role,
                userName: user.userName
            }
            const secret = process.env.ACEESS_SECRET_TOKEN;
            const options = {
                expiresIn: '24h',
                issuer: 'test123.com',
                // audience: user
            }
            Jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    // rej(err)
                    rej(createError.BadRequest(err.message))
                }
                res(token)
            })

        })
    } catch (err) {
        console.log("Error signing access token:", err);
        throw err; // Rethrow the error}
    }


}
const signRefreshToken = async function (user) {
    try {
        return new Promise((res, rej) => {
            const payload = {
                sub: user.id,
                email: user.email,
                userName: user.userName,
                role: user.role
            }
            const secret = process.env.ACEESS_SECRET_TOKEN;
            const options = {
                expiresIn: '1y',
                issuer: 'test123.com',
            }
            Jwt.sign(payload, secret, options, (err, token) => {
                if (err) {

                    // rej(err)
                    rej(createError.BadRequest(err.message))
                }
                res(token)
            })

        })
    } catch (error) {
        console.log("Error signing access token:", error);
        throw error; // Rethrow the error}
    }
}
const verifyAccessToken = (req,res,next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]

    Jwt.verify(token, process.env.ACEESS_SECRET_TOKEN, (err, payload) => {
        if (err) {
            // const message =
                // err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
            return next(createError.Unauthorized(err.message))
        }
        req.payload = payload
        next()
    })
}
const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        Jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN, (err, payload) => {
            if (err) return reject(createError.Unauthorized())
            resolve(payload)
        })
    })

}
const authorizationMiddleware = (allowedRoles) => (req, res, next) => {
    // console.log('Allowed Roles:', allowedRoles);
    // console.log('User Role:', req.payload.role);

    const userRole = req.payload.role.trim(); // Remove leading and trailing spaces

    if (typeof allowedRoles === 'string') {
        // If allowedRoles is a string, split it into an array of roles
        allowedRoles = allowedRoles.split(',').map(role => role.trim());
    }

    if (Array.isArray(allowedRoles)) {
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ message: 'Unauthorized user' });
        }
    } else {
        res.status(403).json({ message: 'Unauthorized user' });
    }
};




module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    authorizationMiddleware
}

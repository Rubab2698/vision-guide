const userTypes = { ADMIN: 'admin', USER: 'customer' };
const allowedDomainExtensions =['com','net'];
const platform = { google: 'google', linkedIn: "linkedIn" }
const status=['available', 'unavailable']
module.exports = {
    userTypes,
    allowedDomainExtensions,
    platform,
    status
}


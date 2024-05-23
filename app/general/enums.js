const userTypes = {
    ADMIN: 'Admin',
    Mentor: "Mentor",
    Mentee: "Mentee",
    Both: "Both"
};
const allowedDomainExtensions = ['com', 'net'];
const platform = {
    google: 'google',
    linkedIn: "linkedIn",
    phone: "phone",
    email: "email"
}
const status = {
    AVAILABLE: "available",
    UNAVAILABLE: "unavailable",
}
const service = {
    BASIC: "oneToOneCall",
    PACKAGE: "package",
    CHAT: "chat",
}



const degree = {
    MASTER: "master",
    BACHELORS:"bachelors",
}


const reqStatuses = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    DONE: "done"
}

const languages = {
    ENGLISH: "english",
    HINDI: "hindi",
    URDU: "urdu",
}

module.exports = {
    userTypes,
    allowedDomainExtensions,
    platform,
    status,
    service,
    degree,
    reqStatuses,
    languages
}


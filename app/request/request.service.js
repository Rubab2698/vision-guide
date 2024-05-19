const { Request, ReqStatuses } = require('./request.model'); // Importing Mongoose models
const mongoose = require('mongoose');
const meet = require('../general/meet');
const moment = require('moment');
const { ObjectId } = require('mongodb');

//request
const createRequest = async (requestData) => {
    try {
        const request = await Request.create(requestData);
        return request;
    } catch (error) {
        throw new Error(`Error creating request: ${error.message}`);
    }
}

const getAllRequests = async () => {
    try {
        const requests = await Request.find();
        return requests;
    } catch (error) {
        throw new Error(`Error getting all requests: ${error.message}`);
    }
}

const getRequestById = async (requestId) => {
    try {
        const request = await Request.findById({ _id: requestId });
        return request;
    } catch (error) {
        throw new Error(`Error getting request by ID: ${error.message}`);
    }
}

const deleteRequest = async (requestId) => {
    try {
        const deletedRequest = await Request.findByIdAndDelete(requestId);
        return deletedRequest;
    } catch (error) {
        throw new Error(`Error deleting request: ${error.message}`);
    }
}

const getAllRequestsByMentorId = async (mentorIdFilter, options) => {
    try {
        const { page, limit ,sortBy  } = options;

        // Parse page and limit as integers with default values
        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 10;

        const mainPipeline = [];

        // Match stage for mentor ID
        if (mentorIdFilter) {
            const matchStage = {
                mentorId: new mongoose.Types.ObjectId(mentorIdFilter)
            };
            mainPipeline.push({ $match: matchStage });
        }

        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'mentorId', foreignField: '_id', as: 'mentorProfile' } });
        mainPipeline.push({
            $unwind: {
                'path': '$mentorProfile',
                'preserveNullAndEmptyArrays': true
            }
        });

        // Populate mentee profiles
        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'menteeId', foreignField: '_id', as: 'menteeProfile' } });
        mainPipeline.push({
            $unwind: {
                'path': '$menteeProfile',
                'preserveNullAndEmptyArrays': true
            }
        });
        // Pagination stages with parsedPage and parsedLimit
        mainPipeline.push({ $sort:{createdAt:-1} });
        mainPipeline.push({ $skip: (parsedPage - 1) * parsedLimit });
        mainPipeline.push({ $limit: parsedLimit });

        // Execute the main pipeline
        const results = await Request.aggregate(mainPipeline);

        // Pipeline for counting total documents
        const countPipeline = [
            // { $match: matchStage }, // Apply match stage for total count
            { $count: 'totalDocuments' },
        ];

        // Execute the count pipeline
        const countResults = await Request.aggregate(countPipeline);

        const totalDocuments = countResults.length > 0 ? countResults[0].totalDocuments : 0;
        const totalPages = Math.ceil(totalDocuments / parsedLimit);

        // Return the response
        const response = {
            results,
            pagination: {
                totalPages,
                currentPage: parsedPage,
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

const getAllRequestsByMenteeId = async (filters, options) => {
    try {
        let { menteeId } = filters;
        const { sortBy, page, limit } = options;

        // Parse page and limit as integers with default values
        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 10;

        const mainPipeline = [];

        // Match stage for menteeId

        if (menteeId) {
            const matchStage = {
                menteeId: new mongoose.Types.ObjectId(menteeId)
            };
            mainPipeline.push({ $match: matchStage });
        }

        if (options && options.sortBy) {
            mainPipeline.push({ $sort: { createdAt: -1 } });
        }

        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'mentorId', foreignField: '_id', as: 'mentorProfile' } });
        mainPipeline.push({
            $unwind: {
                'path': '$mentorProfile',
                'preserveNullAndEmptyArrays': true
            }
        });

        // Populate mentee profiles
        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'menteeId', foreignField: '_id', as: 'menteeProfile' } });
        mainPipeline.push({
            $unwind: {
                'path': '$menteeProfile',
                'preserveNullAndEmptyArrays': true
            }
        });
        // Execute the main pipeline
        const results = await Request.aggregate(mainPipeline);

        // Pipeline for counting total documents
        const countPipeline = [
            { $count: 'totalDocuments' },
        ];

        // Pagination stages with parsedPage and parsedLimit
        mainPipeline.push({ $skip: (parsedPage - 1) * parsedLimit });
        mainPipeline.push({ $limit: parsedLimit });
        // Execute the count pipeline
        const countResults = await Request.aggregate(countPipeline);

        const totalDocuments = countResults.length > 0 ? countResults[0].totalDocuments : 0;
        const totalPages = Math.ceil(totalDocuments / parsedLimit);

        // Return the response
        const response = {
            results,
            pagination: {
                totalPages,
                currentPage: parsedPage,
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

//request status


const createReqStatus = async (reqStatusData) => {
    try {
        const reqStatus = await ReqStatuses.create(reqStatusData);
        if (reqStatusData.status == "accepted") {
            // Format startTime and endTime if not in proper format
            const formattedStartTime = moment(reqStatusData.startTime).format('YYYY-MM-DDTHH:mm:ss');
            const formattedEndTime = moment(reqStatusData.endTime).format('YYYY-MM-DDTHH:mm:ss');

            const eventData = {
                summary: 'Mentorship Meeting',
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                attendees: [
                    { email: reqStatusData.mentorEmail, displayName: reqStatusData.mentorName },
                    { email: reqStatusData.menteeEmail, displayName: reqStatusData.menteeName },
                ],
            };

            const eventt = await meet(eventData);
            return { reqStatus, eventt: eventt.data, meetingLink: eventt.meetingLink };
        }
        if (reqStatusData.status == "rejected" || reqStatusData.status == "pending") {
            return reqStatus;
        }

    } catch (error) {
        throw new Error(`Error creating request status: ${error.message}`);
    }
}

const getAllReqStatuses = async () => {
    try {
        const reqStatuses = await ReqStatuses.find();
        return reqStatuses;
    } catch (error) {
        throw new Error(`Error getting all request statuses: ${error.message}`);
    }
}

const getReqStatusById = async (reqStatusId) => {
    try {
        const reqStatus = await ReqStatuses.findById(reqStatusId);
        return reqStatus;
    } catch (error) {
        throw new Error(`Error getting request status by ID: ${error.message}`);
    }
}


const getAllReqStatusesByMenteeId = async (menteeId, options) => {
    try {
        const { sortBy, page, limit ,status} = options;

        // Parse page and limit as integers with default values
        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 10;

        const mainPipeline = [];

        if (menteeId) {
            const matchStage = {
                menteeId: new mongoose.Types.ObjectId(menteeId)
            };
            mainPipeline.push({ $match: matchStage });
        }

        if (status) {
            const matchStage = {
                status: status
            };
            mainPipeline.push({ $match: matchStage });
        }

        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'mentorId', foreignField: '_id', as: 'mentorProfile' } });
        mainPipeline.push({
            $unwind: {
                'path': '$mentorProfile',
                'preserveNullAndEmptyArrays': true
            }
        });

        // Populate mentee profiles
        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'menteeId', foreignField: '_id', as: 'menteeProfile' } });
        mainPipeline.push({
            $unwind: {
                'path': '$menteeProfile',
                'preserveNullAndEmptyArrays': true
            }
        });

        if (options && options.sortBy) {
            mainPipeline.push({ $sort: { createdAt: -1 } });
        }

        // Pagination stages with parsedPage and parsedLimit
        mainPipeline.push({ $skip: (parsedPage - 1) * parsedLimit });
        mainPipeline.push({ $limit: parsedLimit });

        // Populate mentor profiles
        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'menteeId', foreignField: '_id', as: 'mentorProfile' } });
        mainPipeline.push({
            $unwind: {
                'path': '$mentorProfile',
                'preserveNullAndEmptyArrays': true
            }
        });

        // Execute the main pipeline
        const results = await ReqStatuses.aggregate(mainPipeline);

        // Pipeline for counting total documents
        const countPipeline = [
            { $match: matchStage }, // Apply match stage for total count
            { $count: 'totalDocuments' },
        ];

        // Execute the count pipeline
        const countResults = await ReqStatuses.aggregate(countPipeline);

        const totalDocuments = countResults.length > 0 ? countResults[0].totalDocuments : 0;
        const totalPages = Math.ceil(totalDocuments / parsedLimit);

        // Return the response
        const response = {
            results,
            pagination: {
                totalPages,
                currentPage: parsedPage,
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
const getReqStatusByReqId = async (reqId) => {
    try {
        const reqStatus = await ReqStatuses.findById({ requestId: reqId });
        return reqStatus;
    } catch (error) {
        throw new Error(`Error getting request status by ID: ${error.message}`);
    }
}
const deleteReqStatus = async (reqStatusId) => {
    try {
        const deletedReqStatus = await ReqStatuses.findByIdAndDelete(reqStatusId);
        return deletedReqStatus;
    } catch (error) {
        throw new Error(`Error deleting request status: ${error.message}`);
    }
}

module.exports = {
    createRequest,
    getAllRequests,
    getRequestById,
    deleteRequest,
    createReqStatus,
    getAllReqStatuses,
    getReqStatusById,
    deleteReqStatus,
    getAllRequestsByMentorId,
    getAllRequestsByMenteeId,
    getAllReqStatusesByMenteeId,
    getReqStatusByReqId
};

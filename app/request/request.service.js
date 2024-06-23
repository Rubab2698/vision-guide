const { Request, ReqStatuses, Chat } = require('./request.model'); // Importing Mongoose models
const mongoose = require('mongoose');
const { createMeetingEvent, deleteMeetingEvent } = require('../general/meet');
const moment = require('moment');
const { ObjectId } = require('mongodb');
const { getProfileByUserId } = require('../userProfile/profile.service');
const { object } = require('joi');
const { postPayment } = require('../payment/payment.service')
const { getServiceById } = require('../mentorservice/mentorservice.service')

//request
const createRequest = async (requestData) => {
    try {
        const request = await Request.create(requestData);
        const service = await getServiceById(requestData.serviceId);
        request.amount = service.cost;
        request.save()
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
        const request = await Request.findById({ _id: requestId }).populate('mentorId').populate('menteeId');
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

const getAllRequestsByMentorId = async (mentorIdFilter, reqType, status, options) => {
    try {
        const { page, limit, sortBy } = options;

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
        if (status) {
            const matchStage = {
                status: status.status
            };
            mainPipeline.push({ $match: matchStage });
        }
        if (reqType) {
            const matchStage = {
                requestType: reqType.requestType
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
        mainPipeline.push({ $sort: { createdAt: -1 } });
        mainPipeline.push({ $skip: (parsedPage - 1) * parsedLimit });
        mainPipeline.push({ $limit: parsedLimit });
        console.log(JSON.stringify(mainPipeline));

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

const getAllRequestsByMenteeId = async (filters, reqType, status, options) => {
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

        if (status) {
            const matchStage = {
                status: status.status
            }
            mainPipeline.push({ $match: matchStage });
        }
        if (reqType) {
            const matchStage = {
                requestType: reqType.requestType
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


const createReqStatus = async (reqStatusData, user) => {
    try {

        const isAuthMentor = await getProfileByUserId(user._id)
        if (!isAuthMentor) {
            throw new Error('Unauthorized Mentor');
        }
        const isAlready = await getReqStatusByReqId(reqStatusData.reqId)
        if (isAlready.length > 0) {
            throw new Error('Request Status Already Exists');
        }
        const req = await getRequestById(reqStatusData.reqId);
        const service = await getServiceById(req.serviceId);

        req.status = reqStatusData.status
        await req.save();
        const data = {
            requestType: req.requestType,
            status: reqStatusData.status,
            requestId: reqStatusData.reqId
        }
        const reqStatus = await ReqStatuses.create(data);
        if (!reqStatus) {
            throw new Error('Error creating request status');
        }

        if (reqStatus.status === "accepted") {
            if (req.requestType === "oneToOne") {
                // Format startTime and endTime if not in proper format
                // const formattedStartTime = moment(req.startTime, 'h:mm A').format('YYYY-MM-DDTHH:mm:ss');
                // const formattedEndTime = moment(req.endTime, 'h:mm A').format('YYYY-MM-DDTHH:mm:ss');
                const formattedStartTime = moment.isMoment(req.startTime) ? req.startTime.format('YYYY-MM-DDTHH:mm:ss') : moment(req.startTime).format('YYYY-MM-DDTHH:mm:ss');
                const formattedEndTime = moment.isMoment(req.endTime) ? req.endTime.format('YYYY-MM-DDTHH:mm:ss') : moment(req.endTime).format('YYYY-MM-DDTHH:mm:ss');
              
                const mentorName = req.mentorId.userName.firstName
                const menteeName = req.menteeId.userName.firstName
                const mentorEmail = req.mentorId.email
                const menteeEmail = req.menteeId.email
                const eventData = {
                    summary: 'Mentorship Meeting',
                    startTime: formattedStartTime,
                    endTime: formattedEndTime,
                    attendees: [
                        { email: mentorEmail, displayName: mentorName },
                        { email: menteeEmail, displayName: menteeName },
                    ],
                };

                const eventt = await createMeetingEvent(eventData);
                const meetingLink = eventt.meetingLink
                req.eventId.push(eventt.eventId),
                req.meetingLink.push(meetingLink)
                const request = {}
                Object.assign(request, { meetingLink }, { req });


                const service = await getServiceById(req.serviceId)
                const amount = service.cost
                req.amount = amount
                req.save();

                const paymentData = {
                    mentor: req.mentorId,
                    mentee: req.menteeId,
                    service: req.serviceId,
                    req: req._id,
                    amount: amount,
                    meetingId: req.eventId

                }
                const payment = await postPayment(paymentData)

                // reqStatus.request = req
                return { reqStatus, request };
                // , eventt: eventt.event, meetingLink: eventt.meetingLink 
            }
            if (req.requestType === "package") {
                const mentorName = req.mentorId.userName.firstName;
                const menteeName = req.menteeId.userName.firstName;
                const mentorEmail = req.mentorId.email;
                const menteeEmail = req.menteeId.email;

                const packageTimes = req.package.packageTime;
                const meetings = [];

                for (const timeSlot of packageTimes) {
                    // const formattedStartTime = moment(timeSlot.startTime, 'h:mm A').format('YYYY-MM-DDTHH:mm:ss');
                    // const formattedEndTime = moment(timeSlot.endTime, 'h:mm A').format('YYYY-MM-DDTHH:mm:ss');
                    const formattedStartTime = moment.isMoment(timeSlot.startTime) ? timeSlot.startTime.format('YYYY-MM-DDTHH:mm:ss') : moment(timeSlot.startTime).format('YYYY-MM-DDTHH:mm:ss');
                    const formattedEndTime = moment.isMoment(timeSlot.endTime) ? timeSlot.endTime.format('YYYY-MM-DDTHH:mm:ss') : moment(timeSlot.endTime).format('YYYY-MM-DDTHH:mm:ss');
        

                    const eventData = {
                        summary: 'Mentorship Meeting',
                        startTime: formattedStartTime,
                        endTime: formattedEndTime,
                        attendees: [
                            { email: mentorEmail, displayName: mentorName },
                            { email: menteeEmail, displayName: menteeName },
                        ],
                    };

                    const eventt = await createMeetingEvent(eventData);
                    const meetingLink = eventt.meetingLink;
                    const meetingId = eventt.eventId;
                    req.eventId.push(meetingId)
                    req.meetingLink.push(meetingLink)

                    meetings.push({ meetingLink, meetingId });
                }
 

                const service = await getServiceById(req.serviceId);
                const amount = service.package.cost;
                req.amount= amount
                await req.save();
                const paymentData = {
                    mentor: req.mentorId,
                    mentee: req.menteeId,
                    service: req.serviceId,
                    req: req._id,
                    amount: amount,
                    meetingId: req.eventId
                };
                const payment = await postPayment(paymentData);

                return { reqStatus, meetings };
            }
               }

       
        if (reqStatus.status == "rejected" || reqStatus.status == "pending" || reqStatus.status == "done") {
            return reqStatus;
        }

    } catch (error) {
        throw new Error(`Error creating request status: ${error.message}`);
    }
}

const getAllReqStatuses = async () => {
    try {
        const reqStatuses = await ReqStatuses.find({});
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


const getAllReqStatusesByMenteeId = async (menteeId, reqType, options) => {
    try {
        const { sortBy, page, limit, status } = options;

        // Parse page and limit as integers with default values
        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 10;

        const mainPipeline = [];

        const lookup = {
            from: 'requests',
            localField: 'requestId',
            foreignField: '_id',
            as: 'request'
        };
        mainPipeline.push({ $lookup: lookup });

        mainPipeline.push({ $unwind: '$request' });

        if (menteeId) {
            const matchStage = {
                "request.menteeId": new mongoose.Types.ObjectId(menteeId)
            };
            mainPipeline.push({ $match: matchStage });
        }

        if (reqType) {
            const matchStage = {
                requestType: reqType.requestType
            };
            mainPipeline.push({ $match: matchStage });
        }
        if (status) {
            const matchStage = {
                status: status
            };
            mainPipeline.push({ $match: matchStage });
        }

        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'request.mentorId', foreignField: '_id', as: 'mentorProfile' } });
        mainPipeline.push({
            $unwind: {
                'path': '$mentorProfile',
                'preserveNullAndEmptyArrays': true
            }
        });

        // Populate mentee profiles
        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'request.menteeId', foreignField: '_id', as: 'menteeProfile' } });
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
            // { $match: matchStage }, // Apply match stage for total count
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

const getAllReqStatusesByMentorId = async (mentorId, reqType, options) => {
    try {
        const { sortBy, page, limit, status } = options;

        // Parse page and limit as integers with default values
        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 10;

        const mainPipeline = [];

        const lookup = {
            from: 'requests',
            localField: 'requestId',
            foreignField: '_id',
            as: 'request'
        };
        mainPipeline.push({ $lookup: lookup });

        mainPipeline.push({ $unwind: '$request' });

        if (mentorId) {
            const matchStage = {
                "request.mentorId": new mongoose.Types.ObjectId(mentorId)
            };
            mainPipeline.push({ $match: matchStage });
        }
        if (reqType) {
            const matchStage = {
                requestType: reqType.requestType
            };
            mainPipeline.push({ $match: matchStage });
        }
        if (status) {
            const matchStage = {
                status: status
            };
            mainPipeline.push({ $match: matchStage });
        }

        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'request.mentorId', foreignField: '_id', as: 'mentorProfile' } });
        mainPipeline.push({
            $unwind: {
                'path': '$mentorProfile',
                'preserveNullAndEmptyArrays': true
            }
        });

        // Populate mentee profiles
        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'request.menteeId', foreignField: '_id', as: 'menteeProfile' } });
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
            // { $match: matchStage }, // Apply match stage for total count
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
        const reqStatus = await ReqStatuses.find({ requestId: new mongoose.Types.ObjectId(reqId) });
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

const updateReqStatusById = async (reqStatusId, reqStatusData, user) => {
    try {
        const isAuthMentor = await getProfileByUserId(user._id)
        const req = await getRequestById(reqStatusData.reqId);
        if (toString(req.mentorId._id) !== toString(isAuthMentor._id)) {
            throw new Error('You are not authorized to perform this action');
        }
        const updatedReqStatus = await ReqStatuses.findByIdAndUpdate(reqStatusId, reqStatusData, { new: true });
        if (!updatedReqStatus) {
            throw new Error('Request status not found');
        }


        if (reqStatusData.status == "accepted") {
            // Format startTime and endTime if not in proper format
            const formattedStartTime = moment(req.startTime, 'h:mm A').format('YYYY-MM-DDTHH:mm:ss');
            const formattedEndTime = moment(req.endTime, 'h:mm A').format('YYYY-MM-DDTHH:mm:ss');
            const mentorName = req.mentorId.userName.firstName
            const menteeName = req.menteeId.userName.firstName
            const mentorEmail = req.mentorId.email
            const menteeEmail = req.menteeId.email
            const eventData = {
                summary: 'Mentorship Meeting',
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                attendees: [
                    { email: mentorEmail, displayName: mentorName },
                    { email: menteeEmail, displayName: menteeName },
                ],
            };

            const eventt = await createMeetingEvent(eventData);
            const meetingLink = eventt.meetingLink
            req.eventId = eventt.eventId,
                req.meetingLink = meetingLink
            req.save();
            const request = {}
            Object.assign(request, { meetingLink }, { req });


            const service = await getServiceById(req.serviceId)
            const amount = service.cost
            const paymentData = {
                mentor: req.mentorId,
                mentee: req.menteeId,
                service: req.serviceId,
                req: req._id,
                amount: amount,
                meetingId: req.eventId

            }
            const payment = await postPayment(paymentData)

            // reqStatus.request = req
            return { updatedReqStatus, request };
            // , eventt: eventt.event, meetingLink: eventt.meetingLink 
        }
        if (updatedReqStatus.status == "rejected" || updatedReqStatus.status == "pending") {
            return updatedReqStatus;
        }
    } catch (error) {
        throw new Error(`Error updating request status: ${error.message}`);
    }
}



const cancelMeetingById = async (eventId) => {
    const cancelMeet = await deleteMeetingEvent(eventId)
    if (!cancelMeet) {
        return new Error('Meeting not found')
    }
    return cancelMeet
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
    getAllReqStatusesByMentorId,
    getReqStatusByReqId,
    updateReqStatusById,
    cancelMeetingById
};

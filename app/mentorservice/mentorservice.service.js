const { MentorServiceSchema } = require('./mentorservice.model')
const { Profile } = require('../userProfile/profile.model')
const mongoose = require('mongoose')
const createBasicService = async (req) => {
    try {
        if (req.payload.role !== "Mentor" && req.payload.role !== "Admin") {
            throw new Error('Unauthorized');
        }
        const profile = await Profile.findOne({ userId: req.payload.sub });
        
        if (req.payload.role !== "Mentor" || !profile || profile.role !== "Mentor") {
            throw new Error('Unauthorized to create basic service');
        }
        const alreadyExists = await MentorServiceSchema.findOne({
            mentorProfileId: req.body.mentorProfileId,
        });

        if (alreadyExists) {
            throw new Error('You have already created basic Service');
        }
        // If no existing records found
        if(req.body.serviceType.includes("package")&& req.body.package){
            const noOfdays = req.body.package.packageDays.length
            const cost = req.body.perHourRate * noOfdays * (1 - req.body.package.discount / 100);
            req.body.package.cost = cost        
        }

        const service = new MentorServiceSchema({
            ...req.body
        });

        const savedService = await service.save();
        profile.serviceId = savedService._id
        profile.save();
        return savedService;

    } catch (error) {
        throw error;
    }
};
const getServiceById = async (id) => {
    try {
        const service = await MentorServiceSchema.findById(id)
        if (!service) {
            throw new Error('Service not found')
        }
        return service
    }
    catch (error) {
        throw error
    }
}

const updateBasicService = async (id, role, body, userId) => {
    try {
        if (role !== "Mentor" && role !== "Admin") {
            throw new Error('Unauthorized')
        }
        const profile = await Profile.findOne({ userId: userId });

        if (role !== "Mentor" || !profile || profile.role !== "Mentor") {
            throw new Error('Unauthorized to update basic service');
        }
        const service = await MentorServiceSchema.findById(id);

        if (!service) {
            throw new Error('Service not found')
        }
        if (service.mentorProfileId !== profile._id) {
            throw new Error('Unauthorized')
        }
        Object.assign(service, body);
        service.save();
        return service
    }
    catch (error) {
        throw error
    }
}

const deleteBasicService = async (id, role, userId) => {
    try {
        if (role !== "Mentor" && role !== "Admin") {
            throw new Error('Unauthorized');
        }

        const profile = await Profile.findOne({ userId: userId });

        if (!profile || profile.role !== "Mentor") {
            throw new Error('Unauthorized to delete basic service');
        }

        if (role === "Mentor") {
            const service = await MentorServiceSchema.findById(id);
            if (!service) {
                throw new Error('Service not found');
            }
            if (!service.mentorProfileId.equals(profile._id)) {
                throw new Error('Unauthorized');
            }
        }

        const service = await MentorServiceSchema.findByIdAndDelete(id);
        if (!service) {
            throw new Error('Service not deleted');
        }
        return service;
    } catch (error) {
        throw error;
    }
};


const getAllBasicService = async (filters, options) => {
    try {
        const { mentorId, cost, status } = filters;
        const { sortBy, page, limit } = options;

        // Parse page and limit as integers with default values
        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 10;

        const mainPipeline = [];
        const matchStage = {
            $match: {
                'mentorId': mentorId,
                'cost': cost,
                'status': status,
            },
        };


        const projectStage = {
            $project: {
                'bankDetails': 0, // Exclude password field from the result
            },
        };
        mainPipeline.push(projectStage);

        if (options && options.sortBy) {
            const parsedSortBy = JSON.parse(sortBy);
            mainPipeline.push({ $sort: { userName: parsedSortBy } });
        } else {
            mainPipeline.push({ $sort: { createdAt: -1 } });
        }

        // Pagination stages with parsedPage and parsedLimit
        mainPipeline.push({ $skip: (parsedPage - 1) * parsedLimit });
        mainPipeline.push({ $limit: parsedLimit });

        // Populate mentor profiles
        mainPipeline.push({ $lookup: { from: 'profiles', localField: 'mentorId', foreignField: '_id', as: 'mentorProfile' } });
        mainPipeline.push({
            $unwind: {
                'path': '$mentorProfile',
                'preserveNullAndEmptyArrays': true
            }
        });

        // Execute the main pipeline
        const results = await MentorServiceSchema.aggregate(mainPipeline);

        // Pipeline for counting total documents
        const countPipeline = [
            { $count: 'totalDocuments' },
        ];

        // Execute the count pipeline
        const countResults = await MentorServiceSchema.aggregate(countPipeline);

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


const createPackage = async (req) => {

    if (req.payload.role !== "Mentor" && req.payload.role !== "Admin") {
        throw new Error('Unauthorized');
    }
    const profile = await Profile.findOne({ userId: req.payload.sub });
    
    if (req.payload.role !== "Mentor" || !profile || profile.role !== "Mentor") {
        throw new Error('Unauthorized to create basic service');
    }
    const  body = req.body
    const data = {
        serviceType : body.serviceType,
        perHourRate : body.perHourRate,
        package: body.package,
        mentorProfileId: body.mentorProfileId
    }
    const noOfdays = data.package.packageTime.length
    const cost = data.perHourRate * noOfdays * (1 - data.package.discount / 100);

    data.cost = cost
    const package = new MentorServiceSchema(data)
    await package.save();
    if (package) {
        return package
    }
    else {
        throw new Error("Package not created");
    }
}


module.exports = {
    createBasicService,
    updateBasicService,
    deleteBasicService,
    getAllBasicService,
    getServiceById,
    createPackage
}
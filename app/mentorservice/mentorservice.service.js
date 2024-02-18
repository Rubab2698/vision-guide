 const {MentorServiceSchema} = require('./mentorservice.model')

 const createBasicService = async (req) => {
    try {
        if (req.payload.role !== "Mentor" && req.payload.role !== "Admin") {
            throw new Error('Unauthorized');
        }

        const alreadyExists = await MentorServiceSchema.find({
            mentorId: req.body.mentorId,
        });

        if (alreadyExists === null || alreadyExists.length === 0) {
            // If no existing records found
            const service = new MentorServiceSchema({
                ...req.body
            });

           const savedService = await service.save();
            return savedService;
        } else {
            // If existing records found
            throw new Error('You have already created basic Service');
        }
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

const updateBasicService = async (id, role, body) => {
    try {
        if (role !== "Mentor" && role !== "Admin") {
            throw new Error('Unauthorized')
        }
        const service = await MentorServiceSchema.findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
        if (!service) {
            throw new Error('Service not updated')
        }
        return service
    }
    catch (error) {
        throw error
    }
}

const deleteBasicService = async (id, role) => {
    try {
        if (role !== "Mentor" && role !== "Admin") {
            throw new Error('Unauthorized')
        }
        const service = await MentorServiceSchema.findByIdAndDelete(id)
        if (!service) {
            throw new Error('Service not deleted')
        }
        return service
    }
    catch (error) {
        throw error
    }
}

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
        mainPipeline.push({ $unwind:  {
            'path': '$mentorProfile', 
            'preserveNullAndEmptyArrays': true
          }});

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



module.exports = {
    createBasicService,
    updateBasicService,
    deleteBasicService,
    getAllBasicService,
    getServiceById
}
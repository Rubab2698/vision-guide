const BankDetails = require('./bankdetails.model');

const addBankDetails = async (role, body) => {
    try {
        if (role !== "Mentor" && role !== "Admin") {
            throw new Error('Unauthorized')
        }
        const alreadyExists = await BankDetails.findOne({ account_number: body.account_number })
        if (alreadyExists) {
            throw new Error('Bank Details already exists')
        }
        const bankDetails = new BankDetails(body)
        if (!bankDetails) {
            throw new Error('Bank Details not created')
        }
        await bankDetails.save()
        return bankDetails

    } catch (error) {
        throw error
    }

}
const updateBankDetails = async (id, role, body) => {
    try {
        if (role !== "Mentor" && role !== "Admin") {
            throw new Error('Unauthorized')
        }
        const bankDetails = await BankDetails.findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
        if (!bankDetails) {
            throw new Error('Bank Details not updated')
        }
        return bankDetails
    } catch (error) {
        throw error
    }

}
const deleteBankDetails = async (id, role) => {
    try {
        if (role !== "Mentor" && role !== "Admin") {
            throw new Error('Unauthorized')
        }
        const bankDetails = await BankDetails.findByIdAndDelete(id)
        if (!bankDetails) {
            throw new Error('Bank Details not deleted')
        }
        return bankDetails
    } catch (error) {
        throw error
    }
}
const getBankDetailsById = async (id, role) => {
    try {
        if (role !== "Mentor" && role !== "Admin") {
            throw new Error('Unauthorized')
        }
        const bankDetails = await BankDetails.findById(id)
        if (!bankDetails) {
            throw new Error('Bank Details not found')
        }
        return bankDetails
    } catch (error) {
        throw error
    }
}
const getBankDetails = async (role,options) => {
    try {
        if (role !== "Admin") {
            throw new Error('Unauthorized')
        }
        const { sortBy, page, limit } = options;
        const mainPipeline = [];
        const projectStage = {
            $project: {
                'profile': 1, // Exclude password field from the result
            },
        };
        mainPipeline.push(projectStage);

        if (options && options.sortBy) {
            const parsedSortBy = JSON.parse(sortBy);
            mainPipeline.push({ $sort: { userName: parsedSortBy } });
        } else {
            mainPipeline.push({ $sort: { createdAt: -1 } });
        }

        // Pagination stages
        mainPipeline.push({ $skip: (page - 1) * limit });
        mainPipeline.push({ $limit: parseInt(limit) });

        // Execute the main pipeline
        const results = await Profile.aggregate(mainPipeline);

        // Pipeline for counting total documents
        const countPipeline = [
            { $count: 'totalDocuments' },
        ];

        // Execute the count pipeline
        const countResults = await Profile.aggregate(countPipeline);

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
        throw error
    }
}
 module.exports = {
    addBankDetails,
    updateBankDetails,
    deleteBankDetails,
    getBankDetailsById,
    getBankDetails
 }
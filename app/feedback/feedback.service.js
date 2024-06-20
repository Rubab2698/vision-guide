const { Feedback } = require('./feedback.model');
const {Request, ReqStatuses} = require('../request/request.model')
const { reqStatuses  } = require('../general/enums')
const mongoose = require('mongoose')

// Create a new feedback
const createFeedback = async (feedbackData) => {
    const { serviceId, menteeId, name, email, rating } = feedbackData;

    try {
        const req = await Request.findOne({ serviceId: serviceId });
        if (!req) {
            throw new Error('Req not found');
        }

        const reqStatus = await ReqStatuses.findOne({ requestId: req._id });
        if (!reqStatus) {
            throw new Error('Req status not found');
        }

        if (req.menteeId.toString() !== menteeId.toString()) {
            throw new Error('You are not authorized to give feedback');
        }

        if (reqStatus.status !== reqStatuses.DONE) {
            throw new Error('Request status is not DONE. You are not authorized to give feedback');
        }

        const feedback = new Feedback({
            name: name,
            email: email,
            rating: rating,
            req: req._id,
            mentor: req.mentorId,
            mentee: req.menteeId
        });

        await feedback.save();
        
        return feedback;
    } catch (error) {
        console.error('Error creating feedback:', error);
        throw error; // Propagate the error for proper error handling
    }
};



// Get all feedbacks
const getFeedbackByMentor = async (mentorId) => {
    try {
        const result = await Feedback.aggregate([
            { $match: { mentor:new  mongoose.Types.ObjectId(mentorId) } },
            { $group: { 
                _id: null, 
                averageRating: { $avg: "$rating" } 
            }}
        ]);

        if (result.length > 0) {
            return result[0].averageRating;
        } else {
            // Handle case where there's no feedback (optional)
            console.log(`No feedback found for mentor with ID: ${mentorId}`);
            return null;
        }
    } catch (error) {
        console.error('Error in getFeedbackByMentor:', error.message);
        throw error; // Propagate the error for further handling
    }
};


// Get feedback by ID
const getFeedbackById = async (feedbackId) => {
    return await Feedback.findById(feedbackId);
}

// Delete feedback by ID
const deleteFeedback = async (feedbackId) => {
    return await Feedback.findByIdAndDelete(feedbackId);
};


module.exports = {
    createFeedback,
    getFeedbackByMentor,
    getFeedbackById,
    deleteFeedback
};

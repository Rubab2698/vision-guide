const feedbackService = require('./feedback.service');

// Create a new feedback
const createFeedback = async (req, res, next) => {
    try {
        const feedback = await feedbackService.createFeedback(req.body);
        res.status(201).json(feedback);
    } catch (error) {
        next(error);
    }
};

// Get all feedbacks
const getFeedback = async (req, res, next) => {
    try {
        const feedbacks = await feedbackService.getFeedbackByMentor(req.params.mentorId);
        res.status(200).json(feedbacks);
    } catch (error) {
        next(error);
    }
};

// Get feedback by ID
const getFeedbackById = async (req, res, next) => {
    try {
        const feedback = await feedbackService.getFeedbackById(req.params.feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        next(error);
    }
};



// Delete feedback by ID
const deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await feedbackService.deleteFeedback(req.params.feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        next(error);
    }
};




module.exports = {
    createFeedback,
    getFeedback,
    getFeedbackById,
    deleteFeedback,
};

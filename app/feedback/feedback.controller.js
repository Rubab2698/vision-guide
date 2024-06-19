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
        const feedbacks = await feedbackService.getFeedback();
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

// Report feedback
const reportFeedback = async (req, res, next) => {
    try {
        const report = await feedbackService.reportFeedback(req.body);
        res.status(201).json(report);
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

// Update feedback by ID
const updateFeedback = async (req, res, next) => {
    try {
        const feedback = await feedbackService.updateFeedback(req.params.feedbackId, req.body);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        next(error);
    }
};

// Get all reports
const getReports = async (req, res, next) => {
    try {
        const reports = await feedbackService.getReports();
        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
};

// Get report by ID
const getReport = async (req, res, next) => {
    try {
        const report = await feedbackService.getReportById(req.params.reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
};

// Update report by ID
const updateReport = async (req, res, next) => {
    try {
        const report = await feedbackService.updateReport(req.params.reportId, req.body);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFeedback,
    getFeedback,
    getFeedbackById,
    reportFeedback,
    deleteFeedback,
    updateFeedback,
    getReports,
    getReport,
    updateReport
};

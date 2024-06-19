const { Feedback, Report } = require('./mentorservice.model');

// Create a new feedback
const createFeedback = async (feedbackData) => {
    const feedback = new Feedback(feedbackData);
    await feedback.save();
    return feedback;
};

// Get all feedbacks
const getFeedback = async () => {
    return await Feedback.find();
};

// Get feedback by ID
const getFeedbackById = async (feedbackId) => {
    return await Feedback.findById(feedbackId);
};

// Report feedback
const reportFeedback = async (reportData) => {
    const report = new Report(reportData);
    await report.save();
    return report;
};

// Delete feedback by ID
const deleteFeedback = async (feedbackId) => {
    return await Feedback.findByIdAndDelete(feedbackId);
};

// Update feedback by ID
const updateFeedback = async (feedbackId, feedbackData) => {
    return await Feedback.findByIdAndUpdate(feedbackId, feedbackData, { new: true });
};

// Get all reports
const getReports = async () => {
    return await Report.find();
};

// Get report by ID
const getReportById = async (reportId) => {
    return await Report.findById(reportId);
};

// Update report by ID
const updateReport = async (reportId, reportData) => {
    return await Report.findByIdAndUpdate(reportId, reportData, { new: true });
};

module.exports = {
    createFeedback,
    getFeedback,
    getFeedbackById,
    reportFeedback,
    deleteFeedback,
    updateFeedback,
    getReports,
    getReportById,
    updateReport
};

const Payment = require('./payment.model')

const postPayment = async (req) => {
    const data = {
        service: req.service,
        mentee: req.mentee,
        mentor: req.mentor,
        req: req.req,
        amount: req.amount,
        meetingId: req.meetingId
    }

    const feedback = new Payment(data)
    await feedback.save();
    if (feedback) {
        return feedback
    }
    else {
        throw new Error("Payment not created");
    }
}

const updatePayment = async (reqId, body) => {
    const data = {
        status: body.status
    }
    const payment = await Payment.findOne({ req: reqId })
    if (payment) {
        payment.status = body.status
        payment.save();
        return payment
    }

    else {
        throw new Error("Payment not updated");
    }

}

const getPayment = async (reqId) => {
    const feedback = await Payment.findOne({ req: reqId })
    if (feedback) {
        return feedback;
    }
    else {
        throw new Error("Payment not found");
    }
}
// payment.js


const getPaymentByMeetingId = async (meetingId) => {
    const result = await Payment.find({ meetingId: { $in: meetingId } });
    if (result) {
        return result[0];
    }
    else {
        throw new Error("Payment not found");
    }
};



const axios = require('axios');

async function getPaymentAxios(meetingId) {
  const response = await axios.get(`http://localhost:3000/vision-guide/payment/meeting/${meetingId}`);
  return response.data; // Assuming it returns an object with a 'status' field
}



module.exports = {
    postPayment,
    updatePayment,
    getPayment,
    getPaymentByMeetingId,
    getPaymentAxios

}
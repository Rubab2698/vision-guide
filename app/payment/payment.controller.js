const service =  require('./payment.service')

const createPayment  = async(req,res,next)=>{
    try {
        const payment = await service.postPayment(req.body);
        res.status(201).json(payment);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}


const updatePayment  = async(req,res,next)=>{
    try {
        const payment = await service.updatePayment(req.params.reqId,req.body);
        res.status(201).json(payment);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

const getPayment  = async(req,res,next)=>{
    try {
        const payment = await service.getPayment(req.params.reqId);
        res.status(201).json(payment);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

const getPaymentByMeetingId = async (req, res) => {
  try {
      const payment = await service.getPaymentByMeetingId(req.body.meetingId);
      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports =  {
    updatePayment,
    getPayment,
    createPayment,
    getPaymentByMeetingId
}
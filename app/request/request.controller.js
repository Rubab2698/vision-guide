const {
    createRequest,
    getAllRequests,
    getRequestById,
    deleteRequest,
    getAllRequestsByMentorId,
    getAllRequestsByMenteeId,
    createReqStatus,
    getAllReqStatuses,
    getReqStatusById,
    getReqStatusByReqId,
    deleteReqStatus,
    getAllReqStatusesByMenteeId,
    getAllReqStatusesByMentorId,
    updateReqStatusById,
    chatReq,
    chatStatus
  } = require('./request.service');
  const pick = require('../general/pick')
  
  const postCreateRequest = async (req, res, next) => {
    try {
      const requestData = req.body;
      const request = await createRequest(requestData);
      res.status(201).json({
        message: "Request created successfully",
        request: request
      });
    } catch (error) {
      next(error);
    }
  };
  
  const getAllRequestsWithFilters = async (req, res, next) => {
    try {
      const filters = req.query.filters;
      const options = req.query.options;
      const requests = await getAllRequests(filters, options);
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  };
  
  const getSingleRequestById = async (req, res, next) => {
    try {
      const requestId = req.params.requestId;
      const request = await getRequestById(requestId);
      res.status(200).json(request);
    } catch (error) {
      next(error);
    }
  };
  
  const deleteSingleRequest = async (req, res, next) => {
    try {
      const requestId = req.params.id;
      const deletedRequest = await deleteRequest(requestId);
      res.status(200).json({
        message: "Request deleted successfully",
        deletedRequest: deletedRequest
      });
    } catch (error) {
      next(error);
    }
  };
  
  const getAllRequestsByMentor = async (req, res, next) => {
    try {
      const mentorId = req.params.mentorId;
      const options = pick(req.query, ["sortBy", "page", "limit"]);
      const requests = await getAllRequestsByMentorId( mentorId , options);
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  };
  
  const getAllRequestsByMentee = async (req, res, next) => {
    try {
      const menteeId = req.params.menteeId;
      const options = pick(req.query, ["sortBy", "page", "limit"]);
      const requests = await getAllRequestsByMenteeId({ menteeId }, options);
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  };
  
  const postCreateReqStatus = async (req, res, next) => {
    try {
      const reqStatusData = req.body;
      const reqStatus = await createReqStatus(reqStatusData,req.payload.user);
      res.status(201).json({
        message: "Request status created successfully",
        reqStatus: reqStatus
      });
    } catch (error) {
      next(error);
    }
  };
  
  const getAllReqStatusesController = async (req, res, next) => {
    try {
      
      const reqStatuses = await getAllReqStatuses();
      res.status(200).json(reqStatuses);
    } catch (error) {
      next(error);
    }
  };
  
  const getSingleReqStatusById = async (req, res, next) => {
    try {
      const reqStatusId = req.params.reqStatusId;
      const reqStatus = await getReqStatusById(reqStatusId);
      res.status(200).json(reqStatus);
    } catch (error) {
      next(error);
    }
  };
  
  const getReqStatusByRequestId = async (req, res, next) => {
    try {
      const reqId = req.params.reqId;
      const reqStatus = await getReqStatusByReqId(reqId);
      res.status(200).json(reqStatus);
    } catch (error) {
      next(error);
    }
  };
  
  const deleteSingleReqStatus = async (req, res, next) => {
    try {
      const reqStatusId = req.params.reqStatusId;
      const deletedReqStatus = await deleteReqStatus(reqStatusId);
      res.status(200).json({
        message: "Request status deleted successfully",
        deletedReqStatus: deletedReqStatus
      });
    } catch (error) {
      next(error);
    }
  };

  const getAllReqStatusesByMentee = async (req, res, next) => {
    try {
      const menteeId = req.params.menteeId;
      const options = pick(req.query, ["sortBy", "page", "limit", "status"]);
      const reqStatuses = await getAllReqStatusesByMenteeId(menteeId , options);
      res.status(200).json(reqStatuses);
    } catch (error) {
      next(error);
    }
    
  }
  const getAllReqStatusesByMentor = async (req, res, next) => {
    try {
      const mentorId = req.params.mentorId;
      const options = pick(req.query, ["sortBy", "page", "limit", "status"]);
      const reqStatuses = await getAllReqStatusesByMentorId(mentorId , options);
      res.status(200).json(reqStatuses);
    } catch (error) {
      next(error);
    }
  }
     
  const updateReqStatus = async (req, res, next) => {
    try {
      const reqStatusId = req.params.reqStatusId;
      const reqStatusData = req.body;
      const reqStatus = await updateReqStatusById(reqStatusId, reqStatusData);
      res.status(200).json({
        message: "Request status updated successfully",
        reqStatus: reqStatus
      });
    } catch (error) {
      next(error);
    }
  }

  const createChatReq = async(req,res,next)=>{
    try{
       const chatReq = await chatReq(req.body,req.payload.user)
      res.status(200).json(reqStatuses);
    } catch (error) {
      next(error);
    }
  }

  const chatReqStatus = async(req,res,next)=>{
    try{
       const chatReq = await chatStatus(req.body,req.payload.user)
      res.status(200).json(reqStatuses);
    } catch (error) {
      next(error);
    }
  }

  module.exports = {
    postCreateRequest,
    getAllRequestsWithFilters,
    getSingleRequestById,
    deleteSingleRequest,
    getAllRequestsByMentor,
    getAllRequestsByMentee,
    postCreateReqStatus,
    getAllReqStatusesController,
    getSingleReqStatusById,
    getReqStatusByRequestId,
    deleteSingleReqStatus,
    getAllReqStatusesByMentee,
    getAllReqStatusesByMentor,
    updateReqStatus,
    createChatReq,
    chatReqStatus

  };
  
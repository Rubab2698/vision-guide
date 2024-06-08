const { chatReq, chatStatus, chatSave } = require('./chat.service');
const { notifyConnectionStatus } = require('../socket')
const createChatReq = async(req,res,next)=>{
    try{
       const chatRequest = await chatReq(req.body,req.payload.user)
      res.status(200).json(chatRequest);
    } catch (error) {
      next(error);
    }
  }

  const chatReqStatus = async(req,res,next)=>{
    try{
       const chatreqStatus= await chatStatus(req.body,req.payload.user)
    //    if (req.body.status === 'accepted') {
    //     // notifyConnectionStatus(result.mentorId, result.menteeId); // Notify WebSocket server
    // }
      res.status(200).json(chatreqStatus);
    } catch (error) {
      next(error);
    }
  }


  const saveChat = async (req,res,next)=>{
    try{
      const chat = await chatSave(req.body,req.payload.user)
     res.status(200).json(chat);
   } catch (error) {
     next(error);
   }

  }





  module.exports = {
    createChatReq,
    chatReqStatus,
    saveChat
  }
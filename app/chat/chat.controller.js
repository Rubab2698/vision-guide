// Importing necessary services
const { delRoom,chatReq, chatStatus, chatSave, createChat, userChats, findChat, addMessage, getMessages } = require('./chat.service');

// createChatReq function
const createChatReq = async (req, res, next) => {
    try {
        const chatRequest = await chatReq(req.body, req.payload.user);
        res.status(200).json(chatRequest);
    } catch (error) {
        next(error);
    }
};

const deleteChatRoom = async (req, res, next) => {
    try {
        const chatRequest = await delRoom(req.params.chatId);
        res.status(200).json(chatRequest);
    } catch (error) {
        next(error);
    }
}; 
// chatReqStatus function
const chatReqStatus = async (req, res, next) => {
    try {
        const chatreqStatus = await chatStatus(req.body, req.payload.user);
        res.status(200).json(chatreqStatus);
    } catch (error) {
        next(error);
    }
};

// saveChat function
const saveChat = async (req, res, next) => {
    try {
        const chat = await chatSave(req.body, req.payload.user);
        res.status(200).json(chat);
    } catch (error) {
        next(error);
    }
};

// createChat function
const createNewChat = async (req, res, next) => {
    try {
         const result = await createChat(req, res);
        res.status(201).json(result);

    } catch (error) {
        next(error);
    }
};

// userChats function
const getUserChats = async (req, res, next) => {
    try {
        await userChats(req, res);
    } catch (error) {
        next(error);
    }
};

// findChat function
const getChat = async (req, res, next) => {
    try {
        await findChat(req, res);
    } catch (error) {
        next(error);
    }
};

// addMessage function
const createMessage = async (req, res, next) => {
    try {
        await addMessage(req, res);
    } catch (error) {
        next(error);
    }
};

// getMessages function
const fetchMessages = async (req, res, next) => {
    try {
        await getMessages(req, res);
    } catch (error) {
        next(error);
    }
};

// Exporting functions
module.exports = {
    createChatReq,
    chatReqStatus,
    saveChat,
    createNewChat,
    getUserChats,
    getChat,
    createMessage,
    fetchMessages,
    deleteChatRoom
};

// const router = require('express').Router();
// const verifyAccessToken = require('../middlewares/verifyAccessToken');
// const authorizationMiddleware = require('../middlewares/authorizationMiddleware');
// const validateSchema = require('../middlewares/validateSchema');
// const chatController = require('./chat.controller');
// const chatSchema = require('./chat.schema');

// router.post(
//     '/',
//     verifyAccessToken,
//     authorizationMiddleware(['Mentee', 'Admin', 'Mentor']),
//     validateSchema(chatSchema),
//     chatController.createChat
// );

// module.exports = router


// routes/chat.js
const router = require('express').Router();
const Message = require('../models/Message');
// const auth = require('../middleware/auth');

router.get('/history/:mentorId/:menteeId', async (req, res) => {
    const { mentorId, menteeId } = req.params;
    try {
        const messages = await Message.find({ mentorId, menteeId }).sort('timestamp');
        res.send(messages);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;

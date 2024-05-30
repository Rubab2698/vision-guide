// socket.js
const socketIo = require('socket.io');
const Message = require('./app/chat/chat.model');
const jwt = require('jsonwebtoken');

module.exports = (server) => {
    const io = socketIo(server);

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) return next(new Error('Authentication error'));
                socket.userId = decoded.userId;
                socket.role = decoded.role;
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        socket.on('joinRoom', ({ mentorId, menteeId }) => {
            const room = `${mentorId}-${menteeId}`;
            socket.join(room);
            console.log(`User ${socket.id} joined room ${room}`);
        });

        socket.on('sendMessage', async ({ mentorId, menteeId, message, senderId }) => {
            const room = `${mentorId}-${menteeId}`;
            const newMessage = new Message({
                mentorId,
                menteeId,
                message,
                senderId,
                recieverId: senderId === mentorId ? menteeId : mentorId
            });

            try {
                await newMessage.save();
                io.to(room).emit('receiveMessage', { message, senderId });
            } catch (err) {
                console.error(err);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });

    return io;
};

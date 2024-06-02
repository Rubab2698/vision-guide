const socketIo = require('socket.io');
let io;

function initializeSocket(server) {
    io = socketIo(server);

    // Connection event
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Handle incoming messages
        socket.on('message', (msg) => {
            io.emit('message', msg);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}

function notifyConnectionStatus(mentorId, menteeId) {
    // Notify both mentor and mentee about connection status
    io.to(mentorId).emit('connectionStatus', 'connected');
    io.to(menteeId).emit('connectionStatus', 'connected');
}

module.exports = { initializeSocket, notifyConnectionStatus };

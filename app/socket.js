const socketIo = require('socket.io');
const Chat = require('./request/request.model');
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

        //chating implementation
        socket.on('newChat',function(data){
            socket.broadcast.emit('loadNewChat',data)
        })

        //loads old chats

        socket.on('existChats',async function (data){
          const chats = await Chat.find({$or:[
            {sender_id:data.sender_id ,reciever_id:data.reciever_id},
            {sender_id:data.reciever_id ,reciever_id:data.sender_id }
          ]})

          socket.emit('loadChats',{chat:chats})
        })
    });
}

function notifyConnectionStatus(mentorId, menteeId) {
    // Notify both mentor and mentee about connection status
    io.to(mentorId).emit('connectionStatus', 'connected');
    io.to(menteeId).emit('connectionStatus', 'connected');
}

module.exports = { initializeSocket, notifyConnectionStatus };

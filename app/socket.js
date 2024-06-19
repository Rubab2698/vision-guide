// const socketIo = require('socket.io');
// const Chat = require('./request/request.model');
// let io;

// function initializeSocket(server) {
//     io = socketIo(server);

//     // Connection event
//     io.on('connection', (socket) => {
//         console.log('A user connected');
 
//         // Handle incoming messages
//         socket.on('message', (msg) => {
//             io.emit('message', msg);
//         });

//         // Handle disconnection
//         socket.on('disconnect', () => {
//             console.log('User disconnected');
//         });

//         //chating implementation
//         socket.on('newChat',function(data){
//             socket.broadcast.emit('loadNewChat',data)
//         })

//         //loads old chats

//         socket.on('existChats',async function (data){
//           const chats = await Chat.find({$or:[
//             {sender_id:data.sender_id ,reciever_id:data.reciever_id},
//             {sender_id:data.reciever_id ,reciever_id:data.sender_id }
//           ]})

//           socket.emit('loadChats',{chat:chats})
//         })
//     });
// }

// function notifyConnectionStatus(mentorId, menteeId) {
//     // Notify both mentor and mentee about connection status
//     io.to(mentorId).emit('connectionStatus', 'connected');
//     io.to(menteeId).emit('connectionStatus', 'connected');
// }

// module.exports = { initializeSocket, notifyConnectionStatus };



const socketIo = require('socket.io');

let activeUsers = [];

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    // Add new user
    socket.on("new-user-add", (newUserId) => {
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log("New User Connected", activeUsers);
      }
      io.emit("get-users", activeUsers);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("User Disconnected", activeUsers);
      io.emit("get-users", activeUsers);
    });

    // Send message to a specific user
    socket.on("send-message", (data) => {
      const { receiverId } = data;
      const user = activeUsers.find((user) => user.userId === receiverId);
      console.log("Sending from socket to:", receiverId);
      console.log("Data:", data);
      if (user) {
        io.to(user.socketId).emit("recieve-message", data);
      }
    });
  });
};

module.exports = { initializeSocket };

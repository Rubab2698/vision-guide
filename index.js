const express = require("express");
const http = require('http');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require('http-errors');
const path = require('path');
const router = require('./app/route'); // Import the routes
require('dotenv').config();
const { initializeSocket } = require('./app/socket'); // Import the socket initialization function

const port = process.env.POR||5000;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://database:mydatabase@databse1.efkwybj.mongodb.net/Mentor-Guide', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => { console.log("Mongodb connected..."); })
    .catch((err) => console.log(err));

mongoose.connection.on('connected', () => { console.log("mongodb connected"); });
mongoose.connection.on('error', (err) => { console.log(err.msg); });
mongoose.connection.on('disconnected', () => { console.log("Mongoose connection is disconnected"); });

// Routes
app.use('/vision-guide', router);

// Error Handling Middleware
app.use((req, res, next) => {
    next(createError(404, "Not Found"));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    let error = {
        error: {
            status: err.status || 500,
            message: err.message,
            stack: err.stack
        }
    };
    console.log(error);
    res.send(error);
});

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
initializeSocket(server);

// Listen on the specified port
server.listen(port, () => {
    console.log(`Server is running on port app.js => ${port}`);
});

// Handle SIGINT for graceful shutdown
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require('http-errors');
const path = require('path');
const router = require('./app/route');
require('dotenv').config();

const port = 3000;
const app = express();

// Middleware
app.use(bodyParser.json()); // for handling json data
app.use(bodyParser.urlencoded({ extended: true })); // for handling form data
app.use(cors()); // allowing to access data from all other origins

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

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Specify the views directory
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/vision-guide', router);

// Error Handling Middleware
app.use((req, res, next) => {
    next(createError(404, "Not Found"));
    // next(createError.NotFound('page not found')); // you can use it either this way
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
const http = require('http').Server(app);

// Listen on the specified port
http.listen(port, () => {
    console.log(`Server is running on port app.js => ${port}`);
})

// Handle SIGINT for graceful shutdown
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});

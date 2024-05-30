const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require('http-errors');
const router = require('./app/route');
const http = require('http');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = require('./socket')(server); // Initialize socket.io with the server

const port = process.env.PORT || 3000;

app.use(bodyParser.json());        // for handling json data
app.use(bodyParser.urlencoded({ extended: true })); // for handling form data
app.use(cors());   // allowing to access data from all other origins

mongoose.connect(process.env.MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => { console.log("Mongodb connected...") })
    .catch((err) => console.log(err));

mongoose.connection.on('connected', () => { console.log("mongodb connected") });
mongoose.connection.on('error', (err) => { console.log(err.message) });
mongoose.connection.on('disconnected', () => { console.log("Mongoose connection is disconnected") });

// Middleware to attach io to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/vision-guide', router);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404, "Not Found"));
});

// Error handler
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

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});

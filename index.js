const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require('http-errors')
const router = require('./app/route')
require('dotenv').config();


const port = 3000;

const app = express();
app.use(bodyParser.json());        //for handling json data


app.use(bodyParser.urlencoded({ extended: true })); // for handling form data
app.use(cors());   //allowing to access data from all other origins

mongoose.connect('mongodb+srv://database:mydatabase@databse1.efkwybj.mongodb.net/Mentor-Guide',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => { console.log("Mongodb connected...") })
    .catch((err) => console.log(err));
mongoose.connection.on('connected', () => { console.log("mondodb connected") })
mongoose.connection.on('error', (err) => { console.log(err.msg) })
mongoose.connection.on('disconnected', () => { console.log("Mongooose connection is disconnected") })

app.use('/vision-guide', router);



app.use((req, res, next) => {
    next(createError(404, "Not Founded"))
    //  next(createError.NotFound('page not found'))   : u can use it  either this way

})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    let error = {
        error:
        {
            status: err.status || 500,
            message: err.message,
            stack: err.stack
        }
    }
    console.log(error)
    res.send(error)
})

app.listen(port, () => {
    console.log(`Server is running on port app.js=> ${port}`);
});
process.on("SIGINT", async () => {
    await mongoose.connection.close()
    process.exit(0);
})
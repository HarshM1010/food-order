const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require("cookie-parser");
require("dotenv").config();
const twilio = require("twilio");
require("./utils/scheduleDelete.js");

const app = express();

global.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const authRoutes = require("./routes/auth");


const {dbConnect} = require("./config/db");
const PORT = process.env.PORT || 4000;



const cloudinary = require("./config/Cloudinary");
const { auth } = require('./MiddleWare/auth.js');

// Middleware
app.use(cors({ 
    origin: [
        "http://localhost:3000",
    ],
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
})); 


app.use(express.json());
app.use(cookieParser());

// Routes

app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use("/api/v1/auth",authRoutes);
// MongoDB Connection
dbConnect();
cloudinary.cloudinaryConnect();


// Basic route
app.get("/",(req,res) => {
    res.send(`<h1>This is Home page....</h1>`);
})
app.listen(PORT,() => {
    console.log(`Server started successfully at port ${PORT}`);
})
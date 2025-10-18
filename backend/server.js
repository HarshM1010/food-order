const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require("cookie-parser");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const twilio = require("twilio");
// require("./utils/scheduleDelete.js"); 

// --- ROUTE FILES (STUBS) ---
const VendorRoutes = require('./routes/vendors');
const OrderRoutes = require('./routes/orders'); 
const authRoutes = require("./routes/auth");

// --- CONFIG FILES (STUBS) ---
const {dbConnect} = require("./config/db");
const cloudinary = require("./config/Cloudinary");
const PORT = process.env.PORT || 4000;

const app = express();

// Initialize Twilio client globally
global.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


// --- MIDDLEWARE CONFIGURATION (ORDER MATTERS!) ---

app.use(cors({ 
    origin: [
        "http://localhost:3000",
    ],
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
})); 

app.use(cookieParser());
app.use(express.json()); // Parses JSON body data
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// File Upload Middleware (Handles multipart/form-data for files and text fields)
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/", 
    })
);


// --- ROUTE MOUNTING (The source of the error) ---

// Standardized structure: /api/v1/[domain]
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vendor', VendorRoutes);
// CRITICAL: Matches the Postman URL prefix /api/v1/order
app.use('/api/v1/order', OrderRoutes); 


// --- LIFECYCLE ---

// MongoDB Connection and Cloudinary Setup (Stubs)
dbConnect();
cloudinary.cloudinaryConnect();


// Basic route
app.get("/",(req,res) => {
    res.send(`<h1>This is Home page....</h1>`);
})

// Server Start
app.listen(PORT,() => {
    console.log(`Server started successfully at port ${PORT}`);
})

const express = require('express');
const cors = require('cors');
require("dotenv").config();
import { sendOtp, verifyOtp } from "./controllers/authController.js";
require("./cronJobs/reviewCleanup");
const app = express();

const {dbConnect} = require("./config/db");
const PORT = process.env.PORT || 4000;


const cookieParser = require("cookie-parser");
const cloudinary = require("./config/Cloudinary");

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
app.post("/api/v1/send-otp", sendOtp);
app.post("/api/v1/verify-otp", verifyOtp);
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use("/api/auth", require("./routes/auth"));
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
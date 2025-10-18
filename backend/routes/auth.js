const User = require("../models/user");
const express = require("express");
const bcrypt = require('bcrypt');
const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const serviceSid = process.env.TWILIO_SERVICE_SID;
require("dotenv").config();
const router = express.Router();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { phoneNum } = req.body;

    if (!phoneNum) return res.status(400).json({ msg: "Phone number is required" });

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: phoneNum, channel: "sms" });

    return res.status(200).json({ msg: "OTP sent successfully", status: verification.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error sending OTP", error: err.message });
  }
});

// ✅ Verify OTP and Signup
router.post("/signup", async (req, res) => {
  try {
    const { fname, lname, accountType="Student", phoneNum, email, password, otp } = req.body;
    if(!fname || !accountType || !phoneNum || !password) {
        return res.status(400).json({ msg: "Please provide valid info." });
    }
    if (!otp || !phoneNum)
      return res.status(400).json({ msg: "Phone number and OTP are required" });

    // Check if user already exists
    let existingUser = await User.findOne({ phoneNum });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists. Please log in." });

    // Verify OTP with Twilio
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phoneNum, code: otp });

    if (verificationCheck.status !== "approved")
      return res.status(400).json({ msg: "Invalid or expired OTP" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = await User.create({
      fname,
      lname,
      accountType,
      phoneNum,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const payload = {
        email:newUser.email,
        id:newUser._id,
        accountType:newUser.accountType
    }
    //change the expiry time of token...
    const token = jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn:"9h",issuer:"Uniserve" });
    const userObj = newUser.toObject();
    userObj.token = token;
    userObj.password = undefined;
    const options = {
        expires: new Date(Date.now() + 3*24*60*60*1000), //expires in 3 days...
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Allow cross-domain
    };
    console.log(token);
    res.cookie("token",token,options).status(200).json({
        success:true,
        token,
        userObj,
        message:"user logged in successfully."
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "OTP verification failed,Can't Signin", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phoneNum, password } = req.body;

    if ((!phoneNum && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone number or email and password.",
      });
    }

    // Find user by phoneNum or email
    const user = await User.findOne({
      $or: [{ phoneNum }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }

    // Generate JWT token
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "9h",
      issuer: "Uniserve",
    });

    // Prepare user object
    const userObj = user.toObject();
    userObj.password = undefined;
    userObj.token = token;

    // Cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    // Send response with cookie + token
    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User logged in successfully.",
      token,
      user: userObj,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Login failed.",
      error: err.message,
    });
  }
});
module.exports = router;
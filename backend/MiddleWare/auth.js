const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next) => {
    try{
        // let token = req.body.token || req.cookie.token;
        // if(!token && req.header("Authorization")) {
        //     token = req.header("Authorization").replace("Bearer ","");  // not working 
        // }
        let token = null;
        // console.log("Token from header:", req.headers.authorization);
        // console.log("Token from cookie:", req.cookies.token);
        
        // 1. Fallback to cookie (for httpOnly cookie-based login)
        if(req.cookies.token) {
            token = req.cookies.token;
        }
        // 2.Check for token in Authorization header
        const authHeader = req.headers.authorization;
        if (!token && authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1]; // Get token after "Bearer"
        }
        
        
        // 3.Optional: fallback to token from body or query for dev/testing
        if (!token && req.body.token) {
            token = req.body.token;
        }
        
        console.log(token);
        if(!token) {
            return res.status(401).json({
                success:false,
                message:"Token is missing. User is not logged in."
            })
        }
        //verify the token
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(error) {
            return res.status(401).json({
                success:false,
                message:"Token is invalid" 
            })
        }
        next();
    }catch(error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong, while verifying the user (Token is not valid or expired)."
        })
    }
}
// give attention on expiration time of cookie and token..

//authorization
exports.isStudent = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:"This is a protected path for Student."
            })
        }
        next();
    }catch(error) {
        return res.status(500).json({
            success:false,
            message:"User role is not matching."
        })
    }
}

exports.isVendor = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success:false,
                message:"This is a protected path for Instructor."
            })
        }
        next();
    }catch(error) {
        return res.status(500).json({
            success:false,
            message:"User role is not matching."
        })
    }
}

exports.isAdmin = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success:false,
                message:"This is a protected path for Admin."
            })
        }
        next();
    }catch(error) {
        return res.status(500).json({
            success:false,
            message:"User role is not matching."
        })
    }
}
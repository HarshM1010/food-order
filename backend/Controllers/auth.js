const User = require("../models/user");
const bcrypt = require('bcrypt');
require("dotenv").config();

//changepassword
exports.changePassword = async(req,res) => {
    try{
        const userId = req.user.id;
        const {oldPassword,newPassword,confirmPassword} = req.body;
        if(!oldPassword || !newPassword || !confirmPassword || !userId) {
            return res.status(400).json({
                success:false,
                message:"Please enter all the details carefully."
            })
        }
        if(newPassword !== confirmPassword) {
            return res.status(400).json({
                success:false,
                message:"Please check newPassword and confirmPassword carefully."
            })
        }
        const user = await User.findById(userId).populate("additionalDetails").exec();
        if(!user) {
            return res.status(400).json({
                success:false,
                message:"User can't be found."
            })
        }

        if(!(await bcrypt.compare(oldPassword,user.password))) {
            return res.status(400).json({
                success:false,
                message:"OldPassword doesn't match!",
            })
        }
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(newPassword,10); // 10 here is number of rounds
        }
        catch(error){
            res.status(500).json({
                success:false,
                message:"Error in hashing password"
            })
        }
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Password updated successfully.",
            user
        })
    }catch(error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Error while updating the password, try again after a while."
        })
    }
}
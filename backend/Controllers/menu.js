const menu = require('../models/menu');
const fs = require("fs");
const { uploadToCloudinary } = require("../utils/imageUploader");

const MAX_SIZE = 6 * 1024 * 1024;  //6mb
function isFileTypeSupported(fileType,supportedTypes) {
    return supportedTypes.includes(fileType);
}
exports.createMenu = async (req, res) => {
    try{
        const vendorId = req.params?.id;
        const menuPic = req.files?.menuPic;
        if(!vendorId) {
            return res.status(400).json({
                success:false,
                message:"Please provide vendor ID."
            })
        }
        if (!menuPic) {
            return res.status(400).json({
                success: false,
                message: "Please provide menuPic.",
            });
        }
        //uploading the menuPic to cloudinary
        const supportedFileTypes = ["jpeg","jpg","png"];
        const menuPicType = menuPic.name.split(".").pop().toLowerCase();    
        if(!isFileTypeSupported(menuPicType,supportedFileTypes)) {
            return res.status(400).json({
                success:false,
                message:"File format not supported."
            })
        }
        if(menuPic.size > MAX_SIZE) {
            return res.status(400).json({
                success:false,
                message:"File size too large."
            })
        }
        const filesDir = __dirname + "/files/";
        if (!fs.existsSync(filesDir)) {
            fs.mkdirSync(filesDir);
        }
        const tempFilePath = __dirname + "/files/" + Date.now() + `.${menuPic.name.split(".").pop().toLowerCase()}`;
        await new Promise((resolve, reject) => {
            menuPic.mv(tempFilePath, (err) => {
                if (err) {
                    console.error("Error while saving file locally:", err); 
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        const response = await uploadToCloudinary(tempFilePath,process.env.FOLDER_NAME);
        const image_url = response.secure_url;
        fs.unlinkSync(tempFilePath);
        const newMenu = await menu.create({
            vendor: vendorId,
            menuPic: image_url,
        });
        return res.status(201).json({   
            success: true,
            message: "Menu created successfully.",
            menu: newMenu,
        });
    }catch(err) {
        console.error("Error while creating menu:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create menu. Please try again later.",
            error: err.message,
        });
    }
}

exports.addMenu = async (req, res) => {
    try{
        const vendorId = req.params?.id;
        const menuPic = req.files?.menuPic;
        if(!vendorId) {
            return res.status(400).json({
                success:false,
                message:"Please provide vendor ID."
            })
        }
        if (!menuPic) {
            return res.status(400).json({
                success: false,
                message: "Please provide menuPic.",
            });
        }
        const supportedFileTypes = ["jpeg","jpg","png"];
        const menuPicType = menuPic.name.split(".").pop().toLowerCase();    
        if(!isFileTypeSupported(menuPicType,supportedFileTypes)) {
            return res.status(400).json({
                success:false,
                message:"File format not supported."
            })
        }
        if(menuPic.size > MAX_SIZE) {
            return res.status(400).json({
                success:false,
                message:"File size too large."
            })
        }
        const filesDir = __dirname + "/files/";
        if (!fs.existsSync(filesDir)) {
            fs.mkdirSync(filesDir);
        }
        const tempFilePath = __dirname + "/files/" + Date.now() + `.${menuPic.name.split(".").pop().toLowerCase()}`;
        await new Promise((resolve, reject) => {
            menuPic.mv(tempFilePath, (err) => {
                if (err) {
                    console.error("Error while saving file locally:", err); 
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        const response = await uploadToCloudinary(tempFilePath,process.env.FOLDER_NAME);
        const image_url = response.secure_url;
        fs.unlinkSync(tempFilePath);
        const updatedMenu = await menu.findOneAndUpdate(
            {vendor: vendorId},
            { $push: { menuPic: image_url } },
            {new: true}
        );
        return res.status(200).json({   
            success: true,
            message: "Menu updated successfully.",
            menu: updatedMenu,
        });
    }catch(err) {
        console.error("Error while updating menu:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update menu. Please try again later.",
            error: err.message,
        });
    }
}
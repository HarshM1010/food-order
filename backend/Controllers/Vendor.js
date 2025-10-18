const user = require("../models/user");
const Vendor = require("../models/Vendor");
const fs = require("fs");
const { uploadToCloudinary } = require("../utils/imageUploader");

const MAX_SIZE = 6 * 1024 * 1024;  //6mb
function isFileTypeSupported(fileType,supportedTypes) {
    return supportedTypes.includes(fileType);
}
exports.createVendor = async (req, res) => {
  try {
    // const userId = req.user.id;  
    // const userId = req.params?.userId;
    const {userId , shopName, address, description, timing } = req.body;
    // const vendorPic = req.files?.vendorPic;
    if (!userId) {
    return res.status(400).json({ msg: "User ID is required for shop creation." });
}
    if (!shopName || !address || !description  || !timing) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (shopName, vendorPic, timing).",
      });
    }
    //uploading the vendorPic to cloudinary
    // const supportedFileTypes = ["jpeg","jpg","png"];
    // const vendorPicType = vendorPic.name.split(".").pop().toLowerCase();
    // if(!isFileTypeSupported(vendorPicType,supportedFileTypes)) {
    //     return res.status(400).json({
    //         success:false,
    //         message:"File format not supported."
    //     })
    // }
    // if(vendorPic.size > MAX_SIZE) {
    //     return res.status(400).json({
    //         success:false,
    //         message:"File size too large."
    //     })
    // }
    // const filesDir = __dirname + "/files/";
    // if (!fs.existsSync(filesDir)) {
    //     fs.mkdirSync(filesDir);
    // }
    // const tempFilePath = __dirname + "/files/" + Date.now() + `.${vendorPic.name.split(".").pop().toLowerCase()}`;
    // await new Promise((resolve, reject) => {
    //     vendorPic.mv(tempFilePath, (err) => {
    //         if (err) {
    //             console.error("Error while saving file locally:", err); 
    //             reject(err);
    //         } else {
    //             resolve();
    //         }
    //     });
    // });
    // const response = await uploadToCloudinary(tempFilePath,process.env.FOLDER_NAME);
    // const image_url = response.secure_url;
    // fs.unlinkSync(tempFilePath);

    // Assuming the user is authenticated and ID is stored in req.user.id
    const vendor = await Vendor.create({
      user: userId,
      shopName,
      address,
      description,
    //   vendorPic:image_url,
      timing,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully.",
      vendor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to create vendor.",
      error: err.message,
    });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const userId = req.user.id;
    const { shopName, address, description, timing } = req.body;
    const vendorPic = req.files?.vendorPic;
    
    if(!userId || !vendorId) {
        return res.status(404).json({
        success: false,
        message: "Vendor not found. Try again later.",
      });
    }   
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }
    let image_url;
    if(vendorPic) {
        const supportedFileTypes = ["jpeg","jpg","png"];
        const vendorPicType = vendorPic.name.split(".").pop().toLowerCase();
        if(!isFileTypeSupported(vendorPicType,supportedFileTypes)) {
            return res.status(400).json({
                success:false,
                message:"File format not supported."
            })
        }
        if(vendorPic.size > MAX_SIZE) {
            return res.status(400).json({
                success:false,
                message:"File size too large."
            })
        }
        const filesDir = __dirname + "/files/";
        if (!fs.existsSync(filesDir)) {
            fs.mkdirSync(filesDir);
        }
        const tempFilePath = __dirname + "/files/" + Date.now() + `.${vendorPic.name.split(".").pop().toLowerCase()}`;
        await new Promise((resolve, reject) => {
            vendorPic.mv(tempFilePath, (err) => {
                if (err) {
                    console.error("Error while saving file locally:", err); 
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        const response = await uploadToCloudinary(tempFilePath,process.env.FOLDER_NAME);
        image_url = response.secure_url;
        fs.unlinkSync(tempFilePath);
    }
    const updatedVendor = await Vendor.findByIdAndUpdate(
        vendorId,
        {
            shopName: shopName || vendor.shopName,
            address: address || vendor.address,
            description: description || vendor.description,
            vendorPic: image_url || vendor.vendorPic,
            timing: timing || vendor.timing,
        },
        { new: true,omitUndefined: true}
    );
    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully.",
      updatedVendor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to update vendor.",
      error: err.message,
    });
  }
};

exports.deleteVendor = async(req,res) => {
    try{
        const vendorId = req.params.id;
        const userId = req.user.id;
        if(!userId || !vendorId) {
            return res.status(404).json({
            success: false,
            message: "Vendor not found. Try again later.",
          });
        }
        const vendor = await Vendor.findById(vendorId);
        if(!vendor) {
            return res.status(404).json({
                success:false,
                message:"Vendor not found."
            })
        }
        await Vendor.findByIdAndDelete(vendorId);
        await user.findByIdAndDelete(userId);
        return res.status(200).json({
            success:true,
            message:"Vendor deleted successfully.",
        })
    }catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete vendor.",
            error: err.message,
        });
    }
}

exports.getAllVendors = async(req,res) => {
    try{
        const vendors =  await Vendor.find({});
        return res.status(200).json({
            success:true,
            vendors,
        });
    }catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch vendors.",
            error: err.message,
        });
    }
}

exports.openClose = async(req,res) => {
    try{
        const vendorId = req.params.id;
        const vendor = await Vendor.findById(vendorId);
        if(!vendor) {
            return res.status(404).json({
                success:false,
                message:"Vendor not found."
            })
        }
        vendor.isServing = !vendor.isServing;
        await vendor.save();
        return res.status(200).json({
            success:true,
            message:`Vendor is now ${vendor.isServing ? "open":"closed"} for serving.`,
            vendor,
        });
    }catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to update serving status.",
            error: err.message,
        });
    }
}

exports.getAllVendors = async(req,res) => {
    try{
        const vendors =  await Vendor.find({});
        return res.status(200).json({
            success:true,
            vendors,
        });
    }catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders.",
            error: err.message,
        });
    }
}
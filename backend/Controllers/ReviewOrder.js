const Order = require("../models/Order");
const Review = require("../models/Review");

exports.createReview = async (req, res) => {
    try{
        const orderId = req.params?.id;
        const {review} = req.body;
        if(!orderId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the order to be reviewed."
            })
        }
        const order = await Order.findById(orderId);
        if(!order.isCompleted) {
            return res.status(400).json({
                success:false,
                message:"Cannot review an incomplete order."
            })
        }
        const newReview = new Review({
            order: orderId,
            review,
        });
        await newReview.save();
        return res.status(201).json({
            success:true,
            message:"Review created successfully.",
            review: newReview,
        });
    }catch(err) {
        console.error("Error while creating review:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create review. Please try again later.",
            error: err.message,
        });
    }
}

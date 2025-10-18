const Order = require("../models/Order");
const User = require("../models/user");
const Vendor = require("../models/Vendor");
exports.createOrder = async (req, res) => {
    try{
        const userId = req.user?.id;
        const vendorId = req.params?.id;
        const {orderMsg} = req.body;
        if(!userId || !vendorId) {
            return res.status(400).json({
                success:false,
                message:"Please provide all the details carefully."
            })
        }
        if(!orderMsg) {
            return res.status(400).json({
                success:false,
                message:"Please provide order message."
            })
        }
        const newOrder = await Order.create({
            user: userId,
            vendor: vendorId,
            orderMsg,
            createdAt: Date.now(),
        });
        const user = await User.findById(userId);
        user.orders.push(newOrder._id);
        await user.save();
        const vendor = await Vendor.findById(vendorId);
        vendor.orders.push(newOrder._id);
        await vendor.save();
        return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order: newOrder,
        });
    }catch(err) {
        console.error("Error while creating order:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to place order. Please try again later.",
            error: err.message,
        });
    }
}

exports.editOrder = async(req,res) => {
    try{
        const orderId = req.params?.id;
        const {orderMsg} = req.body;
        if(!orderId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the order to be edited."
            })
        }
        if(!orderMsg) {
            return res.status(400).json({
                success:false,
                message:"Please provide order message."
            })
        }
        const updatedOrder = await Order.findByIdAndUpdate(orderId, {orderMsg}, {new: true});
        return res.status(200).json({
            success:true,
            message:"Order updated successfully.",
            order: updatedOrder,
        })
    }catch(err) {
        console.error("Error while editing order:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to edit order. Please try again later.",
            error: err.message,
        });
    }
}
exports.isCompleted = async(req,res) => {
    try{
        const orderId = req.params?.id;
        if(!orderId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the order to be marked as completed."
            })
        }
        const completedOrder = await Order.findByIdAndUpdate(orderId, {isCompleted: true}, {new: true});
        return res.status(200).json({
            success:true,
            message:"Order marked as completed successfully.",
            order: completedOrder,
        })
    }catch(err) {
        console.error("Error while marking order as completed:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to mark order as completed. Please try again later.",
            error: err.message,
        });
    }
}

exports.isRejected = async(req,res) => {
    try{
        const orderId = req.params?.id;
        if(!orderId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the order to be rejected."
            })
        }
        const rejectedOrder = await Order.findByIdAndUpdate(orderId, {isRejected: true},{isCompleted:true}, {new: true});
        return res.status(200).json({
            success:true,
            message:"Order rejected successfully.",
            order: rejectedOrder,
        });
    }catch(err) {
        console.error("Error while rejecting order:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to reject order. Please try again later.",
            error: err.message,
        });
    }
}

exports.isCancelled = async(req,res) => {
    try{
        const orderId = req.params?.id;
        if(!orderId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the order to be cancelled."
            })
        }
        const cancelledOrder = await Order.findByIdAndUpdate(orderId, {isCancelled: true},{isCompleted:true}, {new: true});
        return res.status(200).json({
            success:true,
            message:"Order cancelled successfully.",
            order: cancelledOrder,
        });
    }catch(err) {
        console.error("Error while cancelling order:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel order. Please try again later.",
            error: err.message,
        });
    }
}

exports.completeAllOrders = async(req,res) => {
    try{
        const vendorId = req.params?.id;
        if(!vendorId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the vendor to complete orders for."
            })
        }
        await Order.updateMany({vendor: vendorId, isCompleted: false}, {isCompleted: true});
        return res.status(200).json({
            success:true,
            message:"All orders for the vendor marked as completed successfully.",
        });
    }catch(err) {
        console.error("Error while completing all orders for vendor:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to complete all orders for vendor. Please try again later.",
            error: err.message,
        });
    }
}
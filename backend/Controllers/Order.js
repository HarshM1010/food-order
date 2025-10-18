const Order = require("../models/Order");
const User = require("../models/user");
const Vendor = require("../models/Vendor");

// Helper function to update user/vendor order lists
const updateEntityOrders = async (Model, id, orderId) => {
    const entity = await Model.findById(id);
    if (entity) {
        // Ensure the orders array exists and push the new ID
        if (!entity.orders) entity.orders = [];
        entity.orders.push(orderId);
        await entity.save();
    }
};

exports.createOrder = async (req, res) => {
    try{
        // 💡 SECURE FIX: Get userId from the authenticated JWT payload
        // const userId = req.user?.id; 
        
        // 💡 FIX: Get vendorId from the URL parameters (as defined in router: /create-order/:vendorId)
        const vendorId = req.params?.vendorId; 
        
        // The order message remains in the body
        const { orderMsg,userId } = req.body; 

        if(!userId) {
             return res.status(401).json({
                 success:false,
                 message:"Authentication failed. Please log in again."
             });
        }
        if(!vendorId) {
             return res.status(400).json({
                 success:false,
                 message:"Vendor ID is missing in the URL path."
             });
        }
        if(!orderMsg) {
            return res.status(400).json({
                success:false,
                message:"Please provide order message."
            });
        }

        // 1. Create the new order document
        const newOrder = await Order.create({
            user: userId,
            vendor: vendorId,
            orderMsg,
            createdAt: Date.now(),
        });
        
        // 2. Update user (Student) and vendor documents to link the order
        await updateEntityOrders(User, userId, newOrder._id);
        await updateEntityOrders(Vendor, vendorId, newOrder._id);

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
};

exports.editOrder = async(req,res) => {
    try{
        const orderId = req.params?.orderId; // Changed to orderId for clarity, check router file
        const {orderMsg} = req.body;
        
        if(!orderId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the order to be edited."
            });
        }
        if(!orderMsg) {
            return res.status(400).json({
                success:false,
                message:"Please provide an updated order message."
            });
        }
        
        const updatedOrder = await Order.findByIdAndUpdate(orderId, {orderMsg}, {new: true});
        
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        
        return res.status(200).json({
            success:true,
            message:"Order updated successfully.",
            order: updatedOrder,
        });
    }catch(err) {
        console.error("Error while editing order:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to edit order. Please try again later.",
            error: err.message,
        });
    }
};

exports.isCompleted = async(req,res) => {
    try{
        const orderId = req.params?.orderId;
        
        if(!orderId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the order to be marked as completed."
            });
        }
        // Update isCompleted field
        const completedOrder = await Order.findByIdAndUpdate(orderId, {isCompleted: true}, {new: true});
        
        if (!completedOrder) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        
        return res.status(200).json({
            success:true,
            message:"Order marked as completed successfully.",
            order: completedOrder,
        });
    }catch(err) {
        console.error("Error while marking order as completed:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to mark order as completed. Please try again later.",
            error: err.message,
        });
    }
};

exports.isRejected = async(req,res) => {
    try{
        const orderId = req.params?.orderId;
        
        if(!orderId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the order to be rejected."
            });
        }
        
        // 🚨 FIX: Corrected Mongoose update syntax
        const rejectedOrder = await Order.findByIdAndUpdate(
            orderId, 
            { isRejected: true, isCompleted: true }, // Combine updates into one object
            { new: true }
        );

        if (!rejectedOrder) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        
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
};

exports.isCancelled = async(req,res) => {
    try{
        const orderId = req.params?.orderId;
        
        if(!orderId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the order to be cancelled."
            });
        }
        
        // 🚨 FIX: Corrected Mongoose update syntax
        const cancelledOrder = await Order.findByIdAndUpdate(
            orderId, 
            { isCancelled: true, isCompleted: true }, // Combine updates into one object
            { new: true }
        );
        
        if (!cancelledOrder) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        
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
};

exports.completeAllOrders = async(req,res) => {
    try{
        const vendorId = req.params?.vendorId; // Changed to vendorId for clarity, check router file
        
        if(!vendorId) {
            return res.status(400).json({
                success:false,
                message:"Cannot find the vendor ID in the URL path."
            });
        }
        
        // Use updateMany to efficiently update all non-completed orders for the vendor
        await Order.updateMany(
            { vendor: vendorId, isCompleted: false }, 
            { isCompleted: true }
        );
        
        return res.status(200).json({
            success:true,
            message:"All pending orders for the vendor marked as completed successfully.",
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

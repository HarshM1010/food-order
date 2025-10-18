const express = require('express');
const router = express.Router();

const { createOrder, editOrder, isCompleted, isRejected, isCancelled, completeAllOrders } = require('../Controllers/Order');
const {auth,isStudent, isVendor} = require("../MiddleWare/auth");
const {createReview} = require("../Controllers/ReviewOrder");

router.post("/create-order/:vendorId",auth,isStudent,createOrder);
router.post("/edit-order/:orderId",auth,isStudent,editOrder);
router.post("/complete-order/:orderId",auth,isVendor,isCompleted);
router.post("/reject-order/:orderId",auth,isVendor,isRejected);
router.post("/cancel-order/:orderId",auth,isStudent,isCancelled);
router.post("/complete-all-orders/:vendorId",auth,isVendor,completeAllOrders);
router.post("/create-review/:orderId",auth,isStudent,createReview);

module.exports = router;
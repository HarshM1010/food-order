const express = require('express');
const router = express.Router();

const { createVendor, updateVendor, deleteVendor, getAllVendors } = require('../Controllers/Vendor');
const { auth, isVendor } = require("../MiddleWare/auth");
const { createNotice } = require('../Controllers/Notice');

router.post("/create-vendor", createVendor);
router.post("/update-vendor/:vendorId", auth, isVendor, updateVendor);
router.delete("/delete-vendor/:vendorId", auth, isVendor, deleteVendor);
router.post("/create-notice", auth, isVendor, createNotice);
router.get("/get-all-vendors", getAllVendors);

module.exports = router;
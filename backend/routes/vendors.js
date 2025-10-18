const express = require('express');
const router = express.Router();

const { createVendor, updateVendor, deleteVendor } = require('../Controllers/Vendor');
const { auth, isVendor } = require("../MiddleWare/auth");
const { createNotice } = require('../Controllers/Notice');

router.post("/create-vendor", auth, isVendor, createVendor);
router.post("/update-vendor/:vendorId", auth, isVendor, updateVendor);
router.delete("/delete-vendor/:vendorId", auth, isVendor, deleteVendor);
router.post("/create-notice", auth, isVendor, createNotice);

module.exports = router;
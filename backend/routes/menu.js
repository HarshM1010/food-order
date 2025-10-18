const express = require('express');
const router = express.Router();

const { createMenu, addMenu } = require('../Controllers/menu');
const {auth,isVendor} = require("../MiddleWare/auth");

router.post("/create-menu",auth,isVendor,createMenu);
router.post("/add-menu",auth,isVendor,addMenu);

module.exports = router;
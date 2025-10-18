const Notice = require("../models/Notice");

// 🟢 Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const vendorId = req.user?.id; // Assuming auth middleware sets req.user
    const { title, message, image, expiresAt } = req.body;

    if (!vendorId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID, title, and message are required.",
      });
    }

    const notice = await Notice.create({
      vendor: vendorId,
      title,
      message,
      image,
      expiresAt,
    });

    return res.status(201).json({
      success: true,
      message: "Notice created successfully.",
      notice,
    });
  } catch (error) {
    console.error("Error creating notice:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating notice.",
    });
  }
};

// 🟡 Get all notices (for students)
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("vendor", "shopName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notices.",
    });
  }
};

// 🟠 Get all notices by a specific vendor
exports.getVendorNotices = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    const notices = await Notice.find({ vendor: vendorId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notices,
    });
  } catch (error) {
    console.error("Error fetching vendor notices:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor notices.",
    });
  }
};

// 🔵 Update a notice
exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, image, expiresAt } = req.body;

    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      { title, message, image, expiresAt },
      { new: true }
    );

    if (!updatedNotice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notice updated successfully.",
      notice: updatedNotice,
    });
  } catch (error) {
    console.error("Error updating notice:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating notice.",
    });
  }
};

// 🔴 Delete a notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotice = await Notice.findByIdAndDelete(id);

    if (!deletedNotice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notice deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting notice.",
    });
  }
};

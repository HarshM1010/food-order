// cronJobs/reviewCleanup.js
const cron = require("node-cron");
const Review = require("../models/Review");

// Run this every hour (or any schedule you prefer)
cron.schedule("0 * * * *", async () => {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const result = await Review.deleteMany({ createdAt: { $lt: cutoff } });

    if (result.deletedCount > 0) {
      console.log(`🧹 Deleted ${result.deletedCount} old reviews older than 24 hours`);
    }
  } catch (error) {
    console.error("Error while deleting old reviews:", error);
  }
});

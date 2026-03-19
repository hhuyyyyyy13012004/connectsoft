const mongoose = require("mongoose");

const JobCacheSchema = new mongoose.Schema({
  keyword: { type: String, required: true, unique: true },
  jobs: { type: Array, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

// Tự động xóa dữ liệu sau 24h để đảm bảo tin tuyển dụng luôn "tươi"
// 86400 giây = 24 giờ
JobCacheSchema.index({ lastUpdated: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("JobCache", JobCacheSchema);

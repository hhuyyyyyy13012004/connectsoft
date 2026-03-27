const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cấu hình thông tin tài khoản Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Thiết lập nơi lưu trữ trên Cloud
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "connectsoft_cv", // Thư mục chứa CV trên Cloudinary
    allowed_formats: ["pdf", "doc", "docx"], // Chỉ nhận các định dạng này
    resource_type: "auto", // Quan trọng để upload được file PDF
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;

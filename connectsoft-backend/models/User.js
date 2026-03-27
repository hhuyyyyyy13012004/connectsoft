const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // --- THÔNG TIN ĐĂNG NHẬP (Cơ bản) ---
    username: {
      type: String,
      required: [true, "Vui lòng nhập tên đăng nhập"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu"],
    },

    // --- HỒ SƠ CHUYÊN MÔN (Giai đoạn 1) ---
    profile: {
      fullName: { type: String, default: "" },
      major: { type: String, default: "Software Engineering" }, // Chuyên ngành mặc định của Huy
      bio: { type: String, default: "" },
      skills: { type: [String], default: [] }, // Danh sách kỹ năng (ví dụ: React, Java)
      education: { type: String, default: "" },
      experience: { type: String, default: "" },

      // Quản lý tệp CV (Sẽ tích hợp ở bước sau)
      resumeUrl: { type: String, default: "" }, // Link file từ Cloudinary
      cloudinaryId: { type: String, default: "" }, // ID dùng để xóa/sửa file
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  },
);

module.exports = mongoose.model("User", userSchema);

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require("../config/cloudinaryConfig");

// API: Cập nhật thông tin Profile và Upload CV
// 'resume' là key mà Frontend sẽ gửi file lên
router.put(
  "/update-profile/:id",
  uploadCloud.single("resume"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, major, bio, skills, education, experience } = req.body;

      // 1. Chuẩn bị dữ liệu cập nhật
      let updateData = {
        "profile.fullName": fullName,
        "profile.major": major,
        "profile.bio": bio,
        "profile.education": education,
        "profile.experience": experience,
        // Chuyển chuỗi skills (từ form) thành mảng nếu cần
        "profile.skills": Array.isArray(skills)
          ? skills
          : skills?.split(",").map((s) => s.trim()),
      };

      // 2. Nếu có upload file thành công, Multer-Cloudinary sẽ trả về req.file
      if (req.file) {
        updateData["profile.resumeUrl"] = req.file.path; // Link URL file trên Cloudinary
        updateData["profile.cloudinaryId"] = req.file.filename; // ID để xóa file sau này
      }

      // 3. Cập nhật vào MongoDB
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }, // Trả về dữ liệu mới nhất sau khi cập nhật
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.status(200).json({
        message: "Cập nhật hồ sơ thành công!",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
  },
);

module.exports = router;

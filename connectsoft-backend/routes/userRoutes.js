const express = require("express");
const multer = require("multer");
const router = express.Router();
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const {
  uploadCloud,
  MAX_AVATAR_FILE_SIZE,
  MAX_RESUME_FILE_SIZE,
} = require("../config/cloudinaryConfig");
const {
  requireAuth,
  requireOwnership,
} = require("../middleware/authMiddleware");

const inferResourceTypeFromUrl = (url = "") => {
  const match = url.match(/\/(image|raw|video)\/upload\//);
  return match?.[1] || "raw";
};

const inferFormatFromUrl = (url = "") => {
  const cleanUrl = url.split("?")[0];
  const extension = cleanUrl.split(".").pop()?.toLowerCase();
  return extension || "pdf";
};

router.get("/:id", requireAuth, requireOwnership, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi lấy hồ sơ người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
});

router.get(
  "/:id/resume-download",
  requireAuth,
  requireOwnership,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select(
        "profile.resumeUrl profile.cloudinaryId profile.resumeResourceType profile.resumeFormat",
      );

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      if (!user.profile?.cloudinaryId) {
        return res.status(404).json({ message: "Người dùng chưa tải CV" });
      }

      const resourceType =
        user.profile.resumeResourceType ||
        inferResourceTypeFromUrl(user.profile.resumeUrl);
      const fileFormat =
        user.profile.resumeFormat || inferFormatFromUrl(user.profile.resumeUrl);

      const downloadUrl = cloudinary.utils.private_download_url(
        user.profile.cloudinaryId,
        fileFormat,
        {
          resource_type: resourceType,
          type: "upload",
          attachment: false,
          expires_at: Math.floor(Date.now() / 1000) + 60 * 10,
        },
      );

      res.status(200).json({ url: downloadUrl });
    } catch (error) {
      console.error("Lỗi tạo link CV:", error);
      res.status(500).json({ message: "Không thể mở CV lúc này" });
    }
  },
);

router.put(
  "/update-profile/:id",
  requireAuth,
  requireOwnership,
  uploadCloud.fields([
    { name: "resume", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, major, bio, skills, education, experience } = req.body;

      const avatarFile = req.files?.avatar?.[0];
      const resumeFile = req.files?.resume?.[0];

      if (avatarFile?.size > MAX_AVATAR_FILE_SIZE) {
        return res.status(400).json({
          message: `Avatar vượt quá dung lượng cho phép (${Math.floor(
            MAX_AVATAR_FILE_SIZE / (1024 * 1024),
          )}MB)`,
        });
      }

      if (resumeFile?.size > MAX_RESUME_FILE_SIZE) {
        return res.status(400).json({
          message: `CV vượt quá dung lượng cho phép (${Math.floor(
            MAX_RESUME_FILE_SIZE / (1024 * 1024),
          )}MB)`,
        });
      }

      const normalizedSkills = Array.isArray(skills)
        ? skills
        : skills
            ?.split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);

      const updateData = {
        "profile.fullName": fullName,
        "profile.major": major,
        "profile.bio": bio,
        "profile.education": education,
        "profile.experience": experience,
        "profile.skills": normalizedSkills || [],
      };

      if (resumeFile) {
        updateData["profile.resumeUrl"] = resumeFile.path;
        updateData["profile.cloudinaryId"] = resumeFile.filename;
        updateData["profile.resumeResourceType"] =
          resumeFile.resource_type ||
          inferResourceTypeFromUrl(resumeFile.path);
        updateData["profile.resumeFormat"] =
          resumeFile.format || inferFormatFromUrl(resumeFile.path);
      }

      if (avatarFile) {
        updateData["profile.avatarUrl"] = avatarFile.path;
        updateData["profile.avatarCloudinaryId"] = avatarFile.filename;
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true },
      ).select("-password");

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

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: `Tệp tải lên vượt quá dung lượng cho phép (${Math.floor(
          MAX_RESUME_FILE_SIZE / (1024 * 1024),
        )}MB)`,
      });
    }

    return res.status(400).json({
      message: error.message || "Tệp tải lên không hợp lệ",
    });
  }

  if (error) {
    console.error("Lỗi upload tệp:", error);
    return res.status(500).json({ message: "Không thể tải tệp lên lúc này" });
  }

  next();
});

module.exports = router;

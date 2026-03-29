const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
    profile: {
      fullName: { type: String, default: "" },
      major: { type: String, default: "Software Engineering" },
      bio: { type: String, default: "" },
      skills: { type: [String], default: [] },
      education: { type: String, default: "" },
      experience: { type: String, default: "" },
      avatarUrl: { type: String, default: "" },
      avatarCloudinaryId: { type: String, default: "" },
      resumeUrl: { type: String, default: "" },
      cloudinaryId: { type: String, default: "" },
      resumeResourceType: { type: String, default: "raw" },
      resumeFormat: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);

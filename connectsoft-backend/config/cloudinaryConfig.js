const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const ALLOWED_RESUME_EXTENSIONS = ["pdf", "doc", "docx"];
const ALLOWED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_AVATAR_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const ALLOWED_AVATAR_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_RESUME_FILE_SIZE = 5 * 1024 * 1024;
const MAX_AVATAR_FILE_SIZE = 3 * 1024 * 1024;
const MAX_UPLOAD_FILE_SIZE = MAX_RESUME_FILE_SIZE;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "avatar") {
      return {
        folder: "connectsoft_avatar",
        allowed_formats: ALLOWED_AVATAR_EXTENSIONS,
        resource_type: "image",
      };
    }

    return {
      folder: "connectsoft_cv",
      allowed_formats: ALLOWED_RESUME_EXTENSIONS,
      resource_type: "auto",
    };
  },
});

const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname || "")
    .replace(".", "")
    .toLowerCase();

  if (file.fieldname === "avatar") {
    const isAllowedExtension = ALLOWED_AVATAR_EXTENSIONS.includes(fileExtension);
    const isAllowedMimeType = ALLOWED_AVATAR_MIME_TYPES.includes(file.mimetype);

    if (!isAllowedExtension || !isAllowedMimeType) {
      const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname);
      error.message = "Avatar chỉ hỗ trợ JPG, JPEG, PNG hoặc WEBP";
      return cb(error);
    }

    return cb(null, true);
  }

  const isAllowedExtension = ALLOWED_RESUME_EXTENSIONS.includes(fileExtension);
  const isAllowedMimeType = ALLOWED_RESUME_MIME_TYPES.includes(file.mimetype);

  if (!isAllowedExtension || !isAllowedMimeType) {
    const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname);
    error.message = "CV chỉ hỗ trợ định dạng PDF, DOC hoặc DOCX";
    return cb(error);
  }

  return cb(null, true);
};

const uploadCloud = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_UPLOAD_FILE_SIZE,
  },
});

module.exports = {
  uploadCloud,
  MAX_RESUME_FILE_SIZE,
  MAX_AVATAR_FILE_SIZE,
  ALLOWED_RESUME_EXTENSIONS,
  ALLOWED_AVATAR_EXTENSIONS,
};

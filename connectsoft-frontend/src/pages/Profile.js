import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUserId,
  syncStoredAuthFromUser,
} from "../utils/auth";

const MAX_RESUME_FILE_SIZE = 5 * 1024 * 1024;
const MAX_AVATAR_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_AVATAR_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const emptyProfile = {
  fullName: "",
  major: "",
  bio: "",
  skills: "",
  education: "",
  experience: "",
};

const formatFileSize = (bytes) => `${Math.round(bytes / (1024 * 1024))}MB`;

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyProfile);
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openingResume, setOpeningResume] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const userId = getStoredUserId();
  const token = getStoredToken();

  useEffect(() => {
    if (!userId || !token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const { user } = res.data;

        setEmail(user.email || "");
        setResumeUrl(user.profile?.resumeUrl || "");
        setAvatarPreview(user.profile?.avatarUrl || "");
        setFormData({
          fullName: user.profile?.fullName || user.username || "",
          major: user.profile?.major || "",
          bio: user.profile?.bio || "",
          skills: Array.isArray(user.profile?.skills)
            ? user.profile.skills.join(", ")
            : "",
          education: user.profile?.education || "",
          experience: user.profile?.experience || "",
        });
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          clearStoredAuth();
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Không thể tải hồ sơ. Vui lòng thử lại.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token, userId]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setAvatarError("");

    if (!nextFile) {
      setAvatarFile(null);
      return;
    }

    const normalizedName = nextFile.name.toLowerCase();
    const hasAllowedExtension = ALLOWED_AVATAR_EXTENSIONS.some((extension) =>
      normalizedName.endsWith(extension),
    );

    if (!hasAllowedExtension) {
      setAvatarFile(null);
      setAvatarError("Avatar chỉ hỗ trợ JPG, JPEG, PNG hoặc WEBP.");
      event.target.value = "";
      return;
    }

    if (nextFile.size > MAX_AVATAR_FILE_SIZE) {
      setAvatarFile(null);
      setAvatarError(
        `Avatar vượt quá dung lượng cho phép (${formatFileSize(MAX_AVATAR_FILE_SIZE)}).`,
      );
      event.target.value = "";
      return;
    }

    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(nextFile);
    setAvatarPreview(URL.createObjectURL(nextFile));
  };

  const handleResumeChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setResumeError("");

    if (!nextFile) {
      setResumeFile(null);
      return;
    }

    const normalizedName = nextFile.name.toLowerCase();
    const hasAllowedExtension = ALLOWED_RESUME_EXTENSIONS.some((extension) =>
      normalizedName.endsWith(extension),
    );

    if (!hasAllowedExtension) {
      setResumeFile(null);
      setResumeError("CV chỉ hỗ trợ định dạng PDF, DOC hoặc DOCX.");
      event.target.value = "";
      return;
    }

    if (nextFile.size > MAX_RESUME_FILE_SIZE) {
      setResumeFile(null);
      setResumeError(
        `CV vượt quá dung lượng cho phép (${formatFileSize(MAX_RESUME_FILE_SIZE)}).`,
      );
      event.target.value = "";
      return;
    }

    setResumeFile(nextFile);
  };

  const handleOpenResume = async () => {
    if (!userId || !token || !resumeUrl) {
      return;
    }

    setOpeningResume(true);
    setError("");

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}/resume-download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      window.open(res.data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearStoredAuth();
        navigate("/login");
        return;
      }

      setError(err.response?.data?.message || "Không thể mở CV lúc này.");
    } finally {
      setOpeningResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    if (resumeError || avatarError) {
      setError(avatarError || resumeError);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (resumeFile) {
        payload.append("resume", resumeFile);
      }

      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/update-profile/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      syncStoredAuthFromUser(res.data.user);
      setResumeUrl(res.data.user.profile?.resumeUrl || "");
      setAvatarPreview(res.data.user.profile?.avatarUrl || "");
      setAvatarFile(null);
      setResumeFile(null);
      setAvatarError("");
      setResumeError("");
      setSuccess("Hồ sơ đã được cập nhật thành công.");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearStoredAuth();
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Cập nhật hồ sơ thất bại. Vui lòng thử lại.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-shell">
          <div className="profile-loading">Đang tải hồ sơ của bạn...</div>
        </div>
      </div>
    );
  }

  const avatarInitial = (formData.fullName || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="profile-page">
      <motion.div
        className="profile-shell"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="profile-hero">
          <div>
            <p className="profile-kicker">Hồ sơ cá nhân</p>
          </div>
          <button
            className="btn-profile-secondary"
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </button>
        </div>

        <div className="profile-grid">
          <section className="profile-card profile-summary">
            {avatarPreview ? (
              <img
                className="profile-avatar profile-avatar-image"
                src={avatarPreview}
                alt={formData.fullName || "Avatar"}
              />
            ) : (
              <div className="profile-avatar">{avatarInitial}</div>
            )}
            <h2>{formData.fullName || "Người dùng ConnectSoft"}</h2>
            <p>{email || "Chưa có email"}</p>
            <div className="profile-summary-list">
              <div>
                <span>Chuyên ngành</span>
                <strong>{formData.major || "Chưa cập nhật"}</strong>
              </div>
              <div>
                <span>Kỹ năng</span>
                <strong>{formData.skills || "Chưa cập nhật"}</strong>
              </div>
            </div>
            {resumeUrl ? (
              <button
                type="button"
                className="btn-profile-primary profile-resume-link"
                onClick={handleOpenResume}
                disabled={openingResume}
              >
                {openingResume ? "Đang mở CV..." : "Xem CV hiện tại"}
              </button>
            ) : (
              <p className="profile-hint">Bạn chưa tải CV lên hệ thống.</p>
            )}
          </section>

          <section className="profile-card">
            {error && (
              <div className="profile-alert profile-alert-error">{error}</div>
            )}
            {success && (
              <div className="profile-alert profile-alert-success">
                {success}
              </div>
            )}

            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-form-grid">
                <div className="input-group">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input type="email" value={email} disabled />
                </div>

                <div className="input-group">
                  <label>Chuyên ngành</label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => handleChange("major", e.target.value)}
                    placeholder="Software Engineering"
                  />
                </div>

                <div className="input-group">
                  <label>Kỹ năng</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => handleChange("skills", e.target.value)}
                    placeholder="React, Node.js, UI/UX"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Avatar</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleAvatarChange}
                />
                <p className="profile-hint">
                  Hỗ trợ JPG, JPEG, PNG, WEBP và tối đa{" "}
                  {formatFileSize(MAX_AVATAR_FILE_SIZE)}.
                </p>
                {avatarFile && (
                  <p className="profile-file-meta">
                    Đã chọn: <strong>{avatarFile.name}</strong>
                  </p>
                )}
                {avatarError && (
                  <p className="profile-file-error">{avatarError}</p>
                )}
              </div>

              <div className="input-group">
                <label>Giới thiệu bản thân</label>
                <textarea
                  rows="4"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Chia sẻ ngắn gọn về định hướng và thế mạnh của bạn"
                />
              </div>

              <div className="input-group">
                <label>Học vấn</label>
                <textarea
                  rows="3"
                  value={formData.education}
                  onChange={(e) => handleChange("education", e.target.value)}
                  placeholder="Ví dụ: HUTECH - Kỹ thuật phần mềm"
                />
              </div>

              <div className="input-group">
                <label>Kinh nghiệm</label>
                <textarea
                  rows="3"
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  placeholder="Mô tả kinh nghiệm thực tập, dự án hoặc hoạt động nổi bật"
                />
              </div>

              <div className="input-group">
                <label>CV</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                />
                <p className="profile-hint">
                  Hỗ trợ PDF, DOC, DOCX và tối đa{" "}
                  {formatFileSize(MAX_RESUME_FILE_SIZE)}.
                </p>
                {resumeFile && (
                  <p className="profile-file-meta">
                    Đã chọn: <strong>{resumeFile.name}</strong>
                  </p>
                )}
                {resumeError && (
                  <p className="profile-file-error">{resumeError}</p>
                )}
              </div>

              <div className="profile-actions">
                <button
                  type="button"
                  className="btn-profile-secondary"
                  onClick={() => navigate("/")}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-profile-primary"
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "Lưu hồ sơ"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

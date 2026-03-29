import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, formData);
      alert(
        "Đăng ký thành công! Hãy đăng nhập để bắt đầu lộ trình của bạn.",
      );
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Đăng ký thất bại. Hãy kiểm tra lại!",
      );
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", marginBottom: "15px" }}
        >
          Connect <span>Soft</span>
        </div>

        <h2>
          Tham gia <span>ConnectSoft</span>
        </h2>
        <p className="auth-subtitle">
          Nền tảng khởi tạo lộ trình sự nghiệp cho riêng bạn.
        </p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Họ và tên</label>
            <input
              type="text"
              placeholder="Võ Hương Trà Mi"
              required
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="mi.vht123@hutech.edu.vn"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Tạo mật khẩu bảo mật (8+ ký tự)"
              required
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button type="submit" className="btn-register-submit">
            Đăng ký
          </button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản?{" "}
          <span onClick={() => navigate("/login")}>Đăng nhập ngay</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

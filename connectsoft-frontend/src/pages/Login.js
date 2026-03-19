import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Nhớ import axios

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Thêm state để hiện lỗi nếu login sai

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi mỗi lần bấm login

    try {
      // Gọi đến API Backend chúng ta vừa viết ở index.js
      const res = await axios.post(
        "https://connectsoft.onrender.com/api/login",
        {
          email,
          password,
        },
      );

      // Nếu thành công: Lưu thông tin vào bộ nhớ trình duyệt
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);

      alert(`Chào mừng ${res.data.user.name} quay trở lại với ConnectSoft!`);

      // Về trang chủ và reload để Navbar cập nhật tên
      navigate("/");
      window.location.reload();
    } catch (err) {
      // Nếu thất bại: Hiện thông báo lỗi từ server gửi về
      setError(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!",
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div
          className="logo"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Connect <span>Soft</span>
        </div>

        <h2>Đăng nhập</h2>
        <p>Tiếp tục hành trình khám phá nghề nghiệp của bạn</p>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <p
            style={{
              color: "#ff7675",
              fontSize: "0.9rem",
              marginBottom: "15px",
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="trami@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login-submit">
            Đăng nhập
          </button>
        </form>

        <div className="login-footer">
          Chưa có tài khoản?{" "}
          <span
            style={{ color: "#00b894", cursor: "pointer", fontWeight: "bold" }}
            /* BƯỚC QUAN TRỌNG: THÊM ONCLICK VÀO ĐÂY */
            onClick={() => navigate("/register")}
          >
            Đăng ký ngay
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;

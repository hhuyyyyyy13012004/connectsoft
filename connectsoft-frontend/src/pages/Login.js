import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { syncStoredAuthFromUser } from "../utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        email,
        password,
      });

      const displayName =
        res.data.user.fullName ||
        res.data.user.username ||
        res.data.user.name ||
        "User";

      localStorage.setItem("token", res.data.token);
      syncStoredAuthFromUser({
        ...res.data.user,
        fullName: displayName,
      });

      alert(`Chào mừng ${displayName} quay trở lại với ConnectSoft!`);
      navigate("/");
    } catch (err) {
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

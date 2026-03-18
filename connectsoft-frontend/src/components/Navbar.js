import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Lấy tên người dùng từ localStorage
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    // Xóa sạch dấu vết đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    // Đưa người dùng về trang chủ và làm mới trang để cập nhật giao diện
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        Connect <span>Soft</span>
      </div>

      <ul className="nav-links">
        <li onClick={() => navigate("/search?keyword=Khám phá")}>Khám phá</li>
        <li onClick={() => navigate("/search?keyword=Thực tập")}>Thực tập</li>
        <li onClick={() => navigate("/search?keyword=Kỹ năng")}>Kỹ năng</li>
      </ul>

      <div className="auth-section">
        {userName ? (
          /* HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP */
          <div className="user-logged-in">
            <span className="welcome-text">
              Chào, <strong>{userName}</strong>
            </span>
            <button className="btn-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        ) : (
          /* HIỂN THỊ KHI CHƯA ĐĂNG NHẬP */
          <button className="btn-login" onClick={() => navigate("/login")}>
            Đăng nhập
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

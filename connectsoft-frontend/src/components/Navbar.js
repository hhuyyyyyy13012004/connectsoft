import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AUTH_USER_UPDATED_EVENT,
  clearStoredAuth,
  getStoredAvatarUrl,
  getStoredUserName,
} from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(getStoredUserName);
  const [avatarUrl, setAvatarUrl] = useState(getStoredAvatarUrl);

  useEffect(() => {
    const syncStoredAuth = () => {
      setUserName(getStoredUserName());
      setAvatarUrl(getStoredAvatarUrl());
    };

    const handleUserUpdated = (event) => {
      setUserName(event.detail?.userName?.trim() || "");
      setAvatarUrl(event.detail?.avatarUrl?.trim() || "");
    };

    window.addEventListener("storage", syncStoredAuth);
    window.addEventListener(AUTH_USER_UPDATED_EVENT, handleUserUpdated);

    return () => {
      window.removeEventListener("storage", syncStoredAuth);
      window.removeEventListener(AUTH_USER_UPDATED_EVENT, handleUserUpdated);
    };
  }, []);

  const handleLogout = () => {
    clearStoredAuth();
    navigate("/");
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
          <div className="user-logged-in">
            <button
              className="btn-profile-link"
              onClick={() => navigate("/profile")}
            >
              {avatarUrl ? (
                <img className="navbar-avatar" src={avatarUrl} alt={userName} />
              ) : (
                <span className="navbar-avatar navbar-avatar-fallback">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
              <span>
                Chào, <strong>{userName}</strong>
              </span>
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <button className="btn-login" onClick={() => navigate("/login")}>
            Đăng nhập
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

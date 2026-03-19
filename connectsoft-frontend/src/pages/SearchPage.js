import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

// --- Component Skeleton (Khung nhấp nháy) ---
const JobSkeleton = () => (
  <div className="job-card" style={{ cursor: "default" }}>
    {/* Logo Skeleton */}
    <div
      className="skeleton"
      style={{
        width: "60px",
        height: "60px",
        borderRadius: "12px",
        marginBottom: "15px",
      }}
    ></div>

    {/* Title Skeleton */}
    <div
      className="skeleton"
      style={{
        width: "80%",
        height: "20px",
        marginBottom: "10px",
        borderRadius: "4px",
      }}
    ></div>

    {/* Company Skeleton */}
    <div
      className="skeleton"
      style={{
        width: "60%",
        height: "15px",
        marginBottom: "15px",
        borderRadius: "4px",
      }}
    ></div>

    {/* Location Skeleton */}
    <div
      className="skeleton"
      style={{
        width: "50%",
        height: "15px",
        marginBottom: "20px",
        borderRadius: "4px",
      }}
    ></div>

    {/* Button Skeleton */}
    <div
      className="skeleton"
      style={{
        width: "100%",
        height: "35px",
        borderRadius: "8px",
      }}
    ></div>
  </div>
);

const SearchPage = ({ openChat }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const keyword = searchParams.get("keyword") || "IT";

  const getFallbackImage = (companyName) => {
    const name = encodeURIComponent(companyName || "Job");
    return `https://ui-avatars.com/api/?name=${name}&background=00b894&color=fff&size=128&bold=true`;
  };

  const handleImageError = (e, companyName) => {
    e.target.onerror = null;
    e.target.src = getFallbackImage(companyName);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://connectsoft.onrender.com/api/category/${keyword}`,
        );
        setJobs(res.data);
      } catch (err) {
        console.error("Lỗi API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
    window.scrollTo(0, 0);
  }, [keyword]);

  const trends = [
    { name: "Digital Marketing", count: "130+", icon: "📈" },
    { name: "UI/UX Designer", count: "150+", icon: "🎨" },
    { name: "Software Engineer", count: "200+", icon: "💻" },
  ];

  return (
    <motion.div
      className="company-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="main-layout">
        <div className="job-list-side">
          <h3>
            Kết quả cho: <span className="search-keyword">"{keyword}"</span>{" "}
            <span className="result-count">({jobs.length} vị trí)</span>
          </h3>

          <div className="job-grid">
            {loading ? (
              // HIỂN THỊ SKELETON KHI ĐANG LOADING
              <>
                {[...Array(6)].map((_, i) => (
                  <JobSkeleton key={i} />
                ))}
              </>
            ) : (
              // HIỂN THỊ DỮ LIỆU THẬT SAU KHI TẢI XONG
              <>
                {jobs.length > 0 ? (
                  jobs.map((job, i) => (
                    <motion.div
                      className="job-card"
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -5 }}
                    >
                      <div
                        className="company-logo-container"
                        style={{
                          background: "#f8f9fa",
                          borderRadius: "12px",
                          padding: "5px",
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "15px",
                        }}
                      >
                        <img
                          className="company-logo"
                          src={
                            job.employer_logo ||
                            getFallbackImage(job.employer_name)
                          }
                          alt={job.employer_name}
                          onError={(e) =>
                            handleImageError(e, job.employer_name)
                          }
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div
                        className="job-title"
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          marginBottom: "5px",
                        }}
                      >
                        {job.job_title}
                      </div>
                      <div
                        className="company-name"
                        style={{ color: "#636e72", marginBottom: "10px" }}
                      >
                        {job.employer_name}
                      </div>
                      <div
                        className="job-location"
                        style={{ fontSize: "0.9rem", color: "#b2bec3" }}
                      >
                        📍 {job.job_city || "Toàn quốc"} •{" "}
                        {job.job_employment_type}
                      </div>
                      <button
                        className="btn-chat"
                        onClick={() => openChat(job.employer_name)}
                        style={{ marginTop: "15px" }}
                      >
                        Chat ngay
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="empty-state">
                    <span className="empty-icon">🔍</span> Rất tiếc, không tìm
                    thấy công việc phù hợp.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <aside className="sidebar">
          <h3 className="sidebar-title">🔥 Xu hướng ngành nghề</h3>
          {trends.map((trend, idx) => (
            <div
              className="trend-item"
              key={idx}
              onClick={() => setSearchParams({ keyword: trend.name })}
            >
              <div className="trend-name">
                <span>{trend.icon}</span>
                {trend.name}
              </div>
              <div className="trend-count">{trend.count}</div>
            </div>
          ))}
          <div className="roadmap-banner">
            <p className="roadmap-text">Bạn muốn hiểu rõ về lộ trình?</p>
            <button
              className="btn-login"
              style={{ marginTop: "10px", width: "100%" }}
            >
              Xem Roadmap
            </button>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};
export default SearchPage;

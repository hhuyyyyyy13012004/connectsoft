import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const SearchPage = ({ openChat }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const keyword = searchParams.get("keyword") || "IT";

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://connectsoft.onrender.com/api/category/${keyword}`,
        );
        setJobs(res.data);
      } catch (err) {
        console.error(err);
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
          {loading ? (
            <div className="loader">Đang tìm kiếm...</div>
          ) : (
            <div className="job-grid">
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
                    <img
                      className="company-logo"
                      src={
                        job.employer_logo || "https://via.placeholder.com/50"
                      }
                      alt="logo"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/50")
                      }
                    />
                    <div className="job-title">{job.job_title}</div>
                    <div className="company-name">{job.employer_name}</div>
                    <div className="job-location">
                      📍 {job.job_city || "Toàn quốc"} •{" "}
                      {job.job_employment_type}
                    </div>
                    <button
                      className="btn-chat"
                      onClick={() => openChat(job.employer_name)}
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
            </div>
          )}
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { COMPANY_LOGOS } from "../constants/CompanyLogos";

// ==========================================
// HÀM XỬ LÝ LOGO THÔNG MINH
// ==========================================
const resolveLogo = (employerName, apiLogo) => {
  if (!employerName)
    return `https://ui-avatars.com/api/?name=Company&background=random`;

  const nameLower = employerName.toLowerCase();
  const matchedKey = Object.keys(COMPANY_LOGOS).find((key) =>
    nameLower.includes(key),
  );
  if (matchedKey) return COMPANY_LOGOS[matchedKey];
  if (apiLogo && apiLogo !== "") return apiLogo;

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    employerName,
  )}&background=00b894&color=fff&bold=true`;
};

// ==========================================
// COMPONENT PHỤ XỬ LÝ ẢNH FEATURED COMPANY
// ==========================================
const FeaturedCompanyLogo = ({ name }) => {
  const [logoUrl, setLogoUrl] = useState(resolveLogo(name, null));

  return (
    <img
      src={logoUrl}
      alt={name}
      style={{ width: "40px", marginBottom: "10px" }}
      onError={(e) => {
        e.target.onError = null;
        setLogoUrl(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name,
          )}&background=random&color=fff`,
        );
      }}
    />
  );
};

const Home = ({ videoData, setSelectedVideoUrl, openChat }) => {
  const [text, setText] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("IT");
  const navigate = useNavigate();

  const categories = ["Marketing", "IT", "Thiết kế", "Tài chính"];

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://connectsoft.onrender.com/api/category/${activeCategory}`,
        );
        setJobs(res.data.slice(0, 6));
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (text.trim()) navigate(`/search?keyword=${text}`);
  };

  return (
    <div className="home-page">
      {/* 1. HERO SECTION - ĐÃ KHÔI PHỤC ẢNH CŨ CỦA HUY */}
      <section className="hero-wrapper">
        <motion.div
          className="hero-content"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            Khám phá <span>nghề nghiệp</span>, <br /> Hiểu rõ{" "}
            <span>doanh nghiệp</span>
          </h1>
          <p className="hero-description">
            Tìm kiếm chi tiết về các ngành nghề và công việc thực tế tại các
            công ty hàng đầu Việt Nam.
          </p>
          <form className="search-container" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Vị trí bạn muốn ứng tuyển..."
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="btn-login">
              Tìm kiếm
            </button>
          </form>
        </motion.div>
        <motion.div
          className="hero-illustration"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* KHÔI PHỤC LINK ẢNH UNPLASH TẠI ĐÂY */}
          <img
            src="https://plus.unsplash.com/premium_vector-1682306737276-670b799c9d1c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="hero illustration"
          />
        </motion.div>
      </section>

      {/* 2. FEATURE CARDS */}
      <section className="feature-grid">
        {[
          { i: "💡", t: "Khám phá ngành nghề" },
          { i: "💼", t: "Hiểu việc thực tế" },
          { i: "📊", t: "Nhu cầu kỹ năng" },
          { i: "🛣️", t: "Lộ trình sự nghiệp" },
        ].map((item, idx) => (
          <motion.div
            className="feature-card"
            key={idx}
            whileHover={{ y: -10, backgroundColor: "#e6f7f4" }}
          >
            <span style={{ marginRight: "10px" }}>{item.i}</span> {item.t}
          </motion.div>
        ))}
      </section>

      {/* 3. BỘ LỌC NGÀNH NGHỀ */}
      <section className="company-section" style={{ paddingBottom: "0" }}>
        <div className="category-list">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. DANH SÁCH VIỆC LÀM */}
      <section className="company-section">
        <h3>Việc làm nổi bật hôm nay</h3>
        {loading ? (
          <div className="loader">Đang tải danh sách {activeCategory}...</div>
        ) : (
          <div className="job-grid">
            {jobs.map((job, i) => (
              <motion.div
                className="job-card"
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  className="company-logo"
                  src={resolveLogo(job.employer_name, job.employer_logo)}
                  alt={job.employer_name}
                  onError={(e) => {
                    e.target.onError = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      job.employer_name,
                    )}&background=random&color=fff`;
                  }}
                />
                <div className="job-title">{job.job_title}</div>
                <div className="company-name">{job.employer_name}</div>
                <div className="job-location">
                  📍 {job.job_city || "Việt Nam"}
                </div>
                <button
                  className="btn-chat"
                  onClick={() => openChat(job.employer_name)}
                >
                  Chat ngay
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 5. DOANH NGHIỆP TIÊU BIỂU */}
      <section className="company-section">
        <h3>Doanh nghiệp tiêu biểu</h3>
        <div className="company-list">
          {["Shopee", "FPT", "Ogilvy", "Lazada", "Tiki", "Vietcombank"].map(
            (name) => (
              <motion.div
                className="company-item"
                key={name}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/search?keyword=${name}`)}
              >
                <FeaturedCompanyLogo name={name} />
                <strong>{name}</strong>
                <div className="company-item-count">100+ Việc làm</div>
              </motion.div>
            ),
          )}
        </div>
      </section>

      {/* 6. VIDEO SECTION */}
      <section className="video-section">
        <h3>Một ngày làm việc</h3>
        <p className="video-description">
          Khám phá thực tế môi trường làm việc qua góc nhìn video
        </p>
        <div className="video-grid">
          {videoData.map((vid, idx) => (
            <motion.div
              className="video-card"
              key={idx}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedVideoUrl(vid.url)}
              style={{ cursor: "pointer" }}
            >
              <div className="thumbnail-container">
                <img src={vid.thumbnail} alt={vid.title} />
                <div className="play-icon">▶</div>
              </div>
              <div className="video-title">{vid.title}</div>
            </motion.div>
          ))}
        </div>
      </section>
      {/* 7. STATS SECTION - THỐNG KÊ TÁC ĐỘNG */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { n: "10K+", t: "Sinh viên tham gia", i: "👨‍🎓" },
            { n: "500+", t: "Doanh nghiệp kết nối", i: "🏢" },
            { n: "2.5K+", t: "Cơ hội thực tập", i: "💼" },
            { n: "95%", t: "Sinh viên có định hướng", i: "🎯" },
          ].map((stat, idx) => (
            <motion.div
              className="stat-item"
              key={idx}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="stat-icon">{stat.i}</div>
              <div className="stat-number">{stat.n}</div>
              <div className="stat-text">{stat.t}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. FOOTER - CHÂN TRANG */}

      {/* 8. TESTIMONIALS - CHIA SẺ TỪ SINH VIÊN */}
      <section className="testimonials-section">
        <h3>Sinh viên nói gì về ConnectSoft?</h3>
        <div className="testimonial-grid">
          {[
            {
              n: "Lê Văn Nam",
              s: "HUTECH - Kỹ thuật phần mềm",
              q: "Nhờ lộ trình kỹ năng trên web, mình đã biết chính xác cần học thêm gì để đậu thực tập tại VNG.",
              i: "https://i.pravatar.cc/100?img=11",
            },
            {
              n: "Trần Mai Anh",
              s: "UEH - Marketing",
              q: "Giao diện rất dễ dùng, mình đã tìm thấy công ty thực tập ngay sau 2 ngày tạo Profile.",
              i: "https://i.pravatar.cc/100?img=5",
            },
            {
              n: "Nguyễn Minh Quân",
              s: "UIT - An toàn thông tin",
              q: "Phần chat trực tiếp với Mentor giúp mình bớt bỡ ngỡ rất nhiều khi lần đầu đi phỏng vấn.",
              i: "https://i.pravatar.cc/100?img=12",
            },
          ].map((item, idx) => (
            <motion.div
              className="testimonial-card"
              key={idx}
              whileHover={{ y: -10 }}
            >
              <div className="quote-icon">“</div>
              <p>{item.q}</p>
              <div className="student-info">
                <img src={item.i} alt={item.n} />
                <div>
                  <strong>{item.n}</strong>
                  <span>{item.s}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 9. FINAL CTA - KÊU GỌI HÀNH ĐỘNG */}
      <section className="final-cta">
        <motion.div
          className="cta-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2>Sẵn sàng bứt phá sự nghiệp ngay hôm nay?</h2>
          <p>
            Tham gia cùng 10,000+ sinh viên đang xây dựng tương lai tại
            ConnectSoft.
          </p>
          <div className="cta-btns">
            <button
              className="btn-primary-large"
              onClick={() => navigate("/register")}
            >
              Đăng ký ngay - Miễn phí
            </button>
            <button
              className="btn-outline-white"
              onClick={() => window.scrollTo(0, 0)}
            >
              Tìm hiểu thêm
            </button>
          </div>
        </motion.div>
      </section>
      <footer className="footer-wrapper">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="footer-logo">
              Connect<span>Soft</span>
            </h2>
            <p>
              Nền tảng kết nối tư duy trẻ với khát vọng doanh nghiệp. Đồng hành
              cùng sinh viên trên lộ trình sự nghiệp.
            </p>
            <div className="social-links">
              <span>🔵</span> <span>📸</span> <span>🐦</span> <span>💼</span>
            </div>
          </div>

          <div className="footer-links">
            <h4>Khám phá</h4>
            <ul>
              <li>
                <a href="#!">Về chúng tôi</a>
              </li>
              <li>
                <a href="#!">Cơ hội thực tập</a>
              </li>
              <li>
                <a href="#!">Kỹ năng thực tế</a>
              </li>
              <li>
                <a href="#!">Cộng đồng sinh viên</a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Hỗ trợ</h4>
            <ul>
              <li>
                <a href="#!">Bảo mật thông tin</a>
              </li>
              <li>
                <a href="#!">Hướng dẫn sử dụng</a>
              </li>
              <li>
                <a href="#!">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="#!">Liên hệ hợp tác</a>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Liên hệ</h4>
            <p>📍 Khu Công nghệ cao, TP. Thủ Đức, TP. HCM</p>
            <p>📧 support@connectsoft.edu.vn</p>
            <p>📞 (028) 1234 5678</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2026 ConnectSoft - Project by Võ Hương Trà Mi. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

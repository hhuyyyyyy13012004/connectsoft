require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// --- IMPORT MODELS & ROUTES ---
const User = require("./models/User"); // Sử dụng Model đã nâng cấp ở Bước 1
const userRoutes = require("./routes/userRoutes"); // Route xử lý Profile & CV

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "ConnectSoft_Secret_2026";

// ==========================================
// KẾT NỐI MONGODB
// ==========================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 Đã kết nối MongoDB thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối DB:", err));

// ==========================================
// 1. CHỨC NĂNG HỆ THỐNG (JSearch API)
// ==========================================
const fetchJobs = async (query) => {
  try {
    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/search",
      params: {
        query,
        page: "1",
        num_pages: "1",
        country: "vn",
        language: "vi",
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      },
    };
    const response = await axios.request(options);
    return response.data.data;
  } catch (error) {
    console.error("❌ Lỗi gọi JSearch API:", error.message);
    throw error;
  }
};

app.get("/api/search", async (req, res) => {
  try {
    const data = await fetchJobs(`${req.query.keyword} in Vietnam`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/category/:name", async (req, res) => {
  try {
    const data = await fetchJobs(`${req.params.name} jobs in Vietnam`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. ROUTES NGƯỜI DÙNG & PROFILE
// ==========================================

// Gắn Route cập nhật Hồ sơ & CV vào prefix /api/users
app.use("/api/users", userRoutes);

// API Đăng ký
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body; // Đổi 'name' thành 'username' cho khớp Model mới

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email này đã tồn tại!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profile: { fullName: username }, // Khởi tạo profile cơ bản
    });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi đăng ký" });
  }
});

// API Đăng nhập
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác!" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id, // Trả về ID để Frontend gọi API update profile sau này
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi đăng nhập" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 ConnectSoft Backend đang chạy tại cổng ${PORT}`),
);

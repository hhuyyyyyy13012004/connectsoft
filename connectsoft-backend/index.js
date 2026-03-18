require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Cho phép tất cả các nguồn truy cập - Quan trọng khi deploy
app.use(cors());
app.use(express.json()); // Đề phòng sau này Huy làm thêm tính năng POST dữ liệu

const PORT = process.env.PORT || 5000;

// Root Route - Dùng để kiểm tra server có sống không sau khi deploy
app.get("/", (req, res) => {
  res.send("🚀 ConnectSoft API is running...");
});

// Hàm bổ trợ gọi API JSearch
const fetchJobs = async (query) => {
  try {
    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/search",
      params: {
        query: query,
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
    console.error(
      "❌ Lỗi gọi JSearch API:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 1. Endpoint tìm kiếm chung
app.get("/api/search", async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword)
      return res.status(400).json({ error: "Thiếu từ khóa tìm kiếm" });

    const data = await fetchJobs(`${keyword} in Vietnam`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Lỗi Server khi tìm kiếm" });
  }
});

// 2. Endpoint theo danh mục
app.get("/api/category/:name", async (req, res) => {
  try {
    const categoryName = req.params.name;
    const data = await fetchJobs(`${categoryName} jobs in Vietnam`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Lỗi Server khi lấy danh mục" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 ConnectSoft Backend đang chạy tại cổng ${PORT}`),
);

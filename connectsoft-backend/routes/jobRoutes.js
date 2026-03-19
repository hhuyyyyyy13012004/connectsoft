const JobCache = require("../models/JobCache");
const axios = require("axios");

// API lấy việc làm theo category/keyword
router.get("/category/:keyword", async (req, res) => {
  const { keyword } = req.params;

  try {
    // 1. Kiểm tra xem từ khóa này đã có trong Database chưa
    const cachedData = await JobCache.findOne({
      keyword: keyword.toLowerCase(),
    });

    if (cachedData) {
      console.log(`⚡ Lấy dữ liệu từ CACHE cho từ khóa: ${keyword}`);
      return res.json(cachedData.jobs);
    }

    // 2. Nếu CHƯA CÓ, tiến hành gọi API JSearch (RapidAPI)
    console.log(`🌐 Gọi API JSearch cho từ khóa: ${keyword}`);
    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: { query: keyword, page: "1", num_pages: "1" },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    const jobData = response.data.data;

    // 3. Lưu kết quả mới vào Database để lần sau dùng luôn
    const newCache = new JobCache({
      keyword: keyword.toLowerCase(),
      jobs: jobData,
      lastUpdated: new Date(),
    });
    await newCache.save();

    res.json(jobData);
  } catch (error) {
    console.error("Lỗi rồi Huy ơi:", error);
    res.status(500).json({ message: "Lỗi kết nối server" });
  }
});

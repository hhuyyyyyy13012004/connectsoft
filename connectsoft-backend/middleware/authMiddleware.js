const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "ConnectSoft_Secret_2026";

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Bạn cần đăng nhập để tiếp tục" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn" });
  }
};

const requireOwnership = (req, res, next) => {
  if (!req.user?.id || req.user.id !== req.params.id) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập dữ liệu này" });
  }

  next();
};

module.exports = { requireAuth, requireOwnership };

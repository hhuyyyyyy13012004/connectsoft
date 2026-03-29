import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

import "./App.css";

const videoData = [
  {
    title: "Tìm hiểu nghề Designer",
    thumbnail:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    title: "Một ngày của Marketing",
    thumbnail:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500",
    url: "https://www.youtube.com/watch?v=oU8r2Fz2TIs",
  },
  {
    title: "Một ngày của Developer",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500",
    url: "https://www.youtube.com/watch?v=Cq_7_7y3XDM",
  },
];

const AnimatedRoutes = ({ setSelectedVideoUrl, openChat }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Home
                videoData={videoData}
                setSelectedVideoUrl={setSelectedVideoUrl}
                openChat={openChat}
              />
            </motion.div>
          }
        />
        <Route
          path="/search"
          element={
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <SearchPage openChat={openChat} />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Register />
            </motion.div>
          }
        />
        <Route
          path="/profile"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Profile />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [chatInfo, setChatInfo] = useState({ open: false, company: "" });
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.split("v=")[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  const openChat = (companyName) => {
    setChatInfo({ open: true, company: companyName });
    setMessages([
      {
        text: `Chào bạn! Tôi là HR từ ${companyName}. Rất vui được hỗ trợ!`,
        type: "bot",
      },
    ]);
  };

  const sendMsg = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const newMessages = [...messages, { text: inputMsg, type: "user" }];
    setMessages(newMessages);
    setInputMsg("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn.", type: "bot" },
      ]);
    }, 1000);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />

        <AnimatedRoutes
          setSelectedVideoUrl={setSelectedVideoUrl}
          openChat={openChat}
        />

        {selectedVideoUrl && (
          <motion.div
            className="video-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedVideoUrl(null)}
          >
            <div
              className="video-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-video"
                onClick={() => setSelectedVideoUrl(null)}
              >
                ×
              </button>
              <div className="video-responsive">
                <iframe
                  src={getEmbedUrl(selectedVideoUrl)}
                  title="Video Player"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {chatInfo.open && (
            <motion.div
              className="chat-popup"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              <div className="chat-header">
                <span>HR - {chatInfo.company}</span>
                <span
                  className="close-btn"
                  onClick={() => setChatInfo({ open: false, company: "" })}
                >
                  ×
                </span>
              </div>
              <div className="chat-messages">
                {messages.map((m, i) => (
                  <div key={i} className={`message ${m.type}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <form className="chat-input" onSubmit={sendMsg}>
                <input
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                />
                <button type="submit">Gửi</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;

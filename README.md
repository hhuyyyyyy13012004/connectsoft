# ConnectSoft - Bridging Students and the Professional Job Market

**ConnectSoft** is a modern career orientation and job-seeking platform designed specifically for students to explore the labor market and connect directly with top businesses in Vietnam.

## 🚀 Key Features

- **Real-time Job Search:** Integrated with **JSearch API** to fetch thousands of verified job listings from LinkedIn, Indeed, and Google Jobs.
- **Smart Caching System:** Implemented a **MongoDB-based caching layer** to reduce API latency by 90% and optimize API quota usage.
- **Modern UI/UX:** Built with a "Mobile-First" approach, featuring:
  - **Skeleton Screens:** For a smooth perceived loading experience.
  - **Framer Motion:** High-quality micro-interactions and transitions.
  - **Geometric Design:** Utilizing professional typography (Montserrat & Inter).
- **Career Insights:** Trending industry sectors, work-life balance videos, and career roadmaps.
- **Direct Interaction:** "Chat Now" feature to facilitate immediate connection with mentors or recruiters.

## 🛠 Tech Stack

**Frontend:**

- React.js (Hooks, Router)
- Framer Motion (Animations)
- Axios (API Management)
- CSS3 (Custom Geometric UI)

**Backend:**

- Node.js & Express.js
- MongoDB Atlas (Database & Caching)
- Mongoose (ODM)

**External Services:**

- JSearch API (via RapidAPI)
- Render (Cloud Deployment)
- UI-Avatars (Dynamic Logo Generation)

## 🏗 System Architecture

The project follows a decoupled architecture:

1.  **Frontend** (Client) sends a search request.
2.  **Backend** checks **MongoDB Atlas** for existing cached data (24h TTL).
3.  If data exists (**Cache Hit**), it returns instantly.
4.  If data is missing (**Cache Miss**), it fetches from **JSearch API**, updates the cache, and returns the result.

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/connectsoft.git
cd connectsoft
```

### 2. Backend Setup

```bash
cd connectsoft-backend
npm install
```

Create a `.env` file in the root of the backend folder:

```env
MONGO_URI=your_mongodb_atlas_connection_string
RAPID_API_KEY=your_jsearch_api_key
PORT=5000
```

Run the server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd ../connectsoft-frontend
npm install
npm start
```

## 🌐 Deployment

- **Frontend:** Hosted on Render (Static Site)
- **Backend:** Hosted on Render (Web Service)
- **Database:** MongoDB Atlas (Singapore Cluster)

## 👤 Author

- **Nguyễn Hoàng Huy**
- 4th-year Software Engineering Student at **HUTECH University**.
- Email: hoanghuyn98@gmail.com
- _Project focus: Full-stack Development & UI/UX Design._

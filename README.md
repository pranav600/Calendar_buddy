# 📅 Calendar Buddy

A full-stack productivity calendar app — add notes, sticky notes, and sync everything to the cloud.

---

## ✨ Features

- 📆 Interactive monthly calendar with 3D page-flip animations
- 🗒️ Day workspace with notes & draggable sticky notes
- 🎨 Per-month color themes (cloud synced)
- 🔐 Google OAuth login
- 🌙 Dark mode support
- 📍 Today button to jump back to current month
- ☁️ Cloud sync via MongoDB

---

## 🛠️ Tech Stack

**Frontend:** Next.js 16, React 18, TypeScript, Tailwind CSS, Framer Motion

**Backend:** Node.js, Express.js, MongoDB, Passport.js (Google OAuth), express-session

**Hosting:** Render (backend) · MongoDB Atlas (database)

---

## 🚀 Getting Started

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
COOKIE_KEY=your_session_secret
MONGO_URI=your_mongodb_uri
CLIENT_URL=http://localhost:3000
PORT=5001
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**

---

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**
2. Create an OAuth 2.0 Client ID (Web app)
3. Add redirect URI: `http://localhost:5001/auth/google/callback`
4. Copy credentials to `backend/.env`

---

## 👨‍💻 Developer

**Pranav** — [GitHub](https://github.com/pranav600) · [LinkedIn](https://linkedin.com/in/pranav)

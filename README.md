# 📅 Calendar Buddy

> A full-stack interactive calendar application to organize your life — day by day.

Calendar Buddy is a modern, minimal productivity web app that lets you view your calendar, add notes and sticky notes to any day, and sync everything to the cloud. Built with a Next.js frontend and an Express + MongoDB backend, with Google OAuth for seamless sign-in.

---

## ✨ Features

- 📆 **Interactive Monthly Calendar** — Navigate months with smooth 3D page-flip animations
- 🗒️ **Day Workspace** — Click any past or present date to open a whiteboard with notes and sticky notes
- 📌 **Sticky Notes** — Add, color, and drag sticky notes to your daily workspace
- 🎨 **Calendar Themes** — Personalize each month with a custom background color (synced to the cloud)
- 🔐 **Google OAuth Login** — Sign in with Google to sync your data across devices
- 🌙 **Dark Mode** — Full dark mode support with a toggle switch
- 📍 **Today Button** — Instantly jump back to the current month from anywhere in the calendar
- 🔗 **GitHub & LinkedIn Links** — Developer links in the footer
- 🎉 **Welcome Banner** — A first-visit welcome modal for new users
- ☁️ **Cloud Sync** — Notes, stickies, and color preferences stored in MongoDB via the backend

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 18](https://react.dev/) | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [date-fns](https://date-fns.org/) | Date manipulation |
| [react-icons](https://react-icons.github.io/react-icons/) | Icon library (GitHub, LinkedIn, Google) |
| [@heroicons/react](https://heroicons.com/) | UI icons |
| [react-toggle-dark-mode](https://www.npmjs.com/package/react-toggle-dark-mode) | Dark mode toggle switch |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| [Express.js](https://expressjs.com/) | Web server framework |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database & ODM |
| [Passport.js](https://www.passportjs.org/) | Authentication middleware |
| [passport-google-oauth20](https://www.passportjs.org/packages/passport-google-oauth20/) | Google OAuth 2.0 strategy |
| [express-session](https://www.npmjs.com/package/express-session) | Session management |
| [connect-mongo](https://www.npmjs.com/package/connect-mongo) | MongoDB session store |
| [dotenv](https://www.npmjs.com/package/dotenv) | Environment variable management |
| [cors](https://www.npmjs.com/package/cors) | Cross-Origin Resource Sharing |

### Hosting
| Service | Purpose |
|---|---|
| [Render](https://render.com/) | Backend API hosting |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud database |
| [Vercel](https://vercel.com/) *(recommended)* | Frontend hosting |

---

## 🗂️ Project Structure

```
Calendar_buddy/
├── frontend/                   # Next.js App
│   ├── app/
│   │   ├── layout.tsx          # Root layout with theme support
│   │   ├── page.tsx            # Main home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Calendar.tsx        # Interactive monthly calendar
│   │   ├── WhiteboardWorkspace.tsx  # Day notes & sticky notes panel
│   │   ├── Navbar.tsx          # Top navigation with auth
│   │   ├── Footer.tsx          # Footer with social links
│   │   ├── LoginModal.tsx      # Google sign-in modal
│   │   ├── ComingSoonModal.tsx # Welcome banner for new users
│   │   └── DraggableStickyNote.tsx  # Draggable sticky note component
│   ├── types/                  # TypeScript type declarations
│   └── public/                 # Static assets (icons, images)
│
└── backend/                    # Express API
    ├── routes/
    │   ├── auth.js             # Google OAuth routes
    │   ├── events.js           # Calendar events CRUD
    │   └── user.js             # User profile & color preferences
    ├── models/                 # Mongoose data models
    ├── utils/                  # Helper utilities
    ├── passport.js             # Passport Google strategy config
    └── server.js               # Express server entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Cloud project with OAuth 2.0 credentials

---

### 1. Clone the Repository

```bash
git clone https://github.com/pranav600/Calendar_buddy.git
cd Calendar_buddy
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
COOKIE_KEY=your_random_session_secret
MONGO_URI=your_mongodb_atlas_connection_string
ENCRYPTION_KEY=your_encryption_key
CLIENT_URL=http://localhost:3000
PORT=5001
```

Start the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
NEXT_PUBLIC_GITHUB_URL=https://github.com/your_github_username
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/your_linkedin
```

Start the frontend:

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

---

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services → Credentials**
4. Create an **OAuth 2.0 Client ID** (Web application)
5. Add these to **Authorized redirect URIs**:
   - `http://localhost:5001/auth/google/callback` (local dev)
   - `https://your-backend.onrender.com/auth/google/callback` (production)
6. Copy the **Client ID** and **Client Secret** to your backend `.env`

---

## 🌐 Deployment

### Backend (Render)
1. Push your code to GitHub
2. Create a new **Web Service** on [Render](https://render.com/)
3. Set the root directory to `backend/`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables from `.env`

### Frontend (Vercel)
1. Import the repository on [Vercel](https://vercel.com/)
2. Set the root directory to `frontend/`
3. Add environment variables (`NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_LINKEDIN_URL`)
4. Deploy!

---

## 👨‍💻 Developer

**Pranav** — [GitHub](https://github.com/pranav600) · [LinkedIn](https://linkedin.com/in/pranav)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

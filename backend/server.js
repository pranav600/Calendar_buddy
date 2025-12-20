require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
require("./passport");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));
const app = express();

app.set("trust proxy", 1); // Trust first proxy (required for Render/Heroku)

app.use(
  session({
    secret: process.env.COOKIE_KEY || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true, // Required for SameSite="None"
      sameSite: "none", // Required for cross-origin (Frontend on localhost, Backend on Render)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/events", require("./routes/events"));
app.use("/user", require("./routes/user"));

// Health check
app.get("/", (req, res) => res.send("🟢 Calendar Buddy API is running"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

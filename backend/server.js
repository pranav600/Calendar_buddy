require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
require("./passport");

const app = express();

app.use(
	session({
		secret: process.env.COOKIE_KEY || "secret",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 24 * 60 * 60 * 1000 }
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use(express.json());

// Routes
app.use("/auth", authRoutes);

const PORT = 5001; // Hardcoded to avoid conflict
console.log("PORT from env:", process.env.PORT);
console.log("Using PORT:", PORT);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
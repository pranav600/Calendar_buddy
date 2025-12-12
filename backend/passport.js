const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "http://localhost:5001/auth/google/callback",
		},
		function (accessToken, refreshToken, profile, done) {
			// Mock user for now since we haven't set up DB models fully
			// In production, find or create user in DB
			const user = {
				id: profile.id,
				displayName: profile.displayName,
                photos: profile.photos
			};
			done(null, user);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

import User from "../models/userSchema.js";
import passport from "passport";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, role, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ firstName, lastName, email, role });
    await User.register(newUser, password);

    req.login(newUser, (err) => {
      if (err) return res.status(500).json({ message: "Login after registration failed", err });
      return res.status(201).json({ message: "User registered successfully", user: req.user });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    req.login(user, (logErr) => {
      if (logErr) return next(logErr);
      res.status(200).json({ 
        message: "Logged in successfully", 
        user,
        isAuthenticated: true 
      });
    });
  })(req, res, next);
};

export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout error", err });

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.clearCookie('connect.sid', { path: '/' });
      res.clearCookie("connect.sid", {
        path: '/',
        secure: false,
        httpOnly: true 
      });

      res.status(200).json({ message: "Logged out successfully" });
    });
  });
};

export const status = (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ loggedIn: true, user: req.user });
  }
  res.json({ loggedIn: false });
};
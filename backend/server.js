import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './router/authRoutes.js';
import session from "express-session";
import passport from "passport";
import User from './models/userSchema.js';
import userRoutes from './router/userRoutes.js';
import taskRoutes from './router/taskRoutes.js';
import applicationRoutes from './router/applicationRoutes.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import path from 'path';
app.use('/uploads/tasks', express.static(path.join(process.cwd(), 'uploads/tasks')));
app.use('/uploads/profilePics', express.static(path.join(process.cwd(), 'uploads/profilePics')));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000*60*60*24*7
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/applications', applicationRoutes);

app.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ loggedIn: true, user: req.user });
    }
    res.json({ loggedIn: false });
});

const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer();
import express from 'express';
import User from '../models/userSchema.js';
import multer from 'multer';
import path from 'path';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Multer setup for profile picture
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads/profilePics'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Admin-only: get all users
router.get('/all', isAuthenticated, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        const users = await User.find().select('-salt -hash');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
});

router.get('/me', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-salt -hash');
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch profile', error });
    }
});

router.put('/me', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        const { firstName, lastName, bio, skills, location } = req.body;
        const update = {
            ...(firstName !== undefined && { firstName }),
            ...(lastName !== undefined && { lastName }),
            ...(bio !== undefined && { bio }),
            ...(location !== undefined && { location }),
        };
        if (Array.isArray(skills)) update.skills = skills;
        if (req.file) {
            update.profilePicture = `/uploads/profilePics/${req.file.filename}`;
        }
        const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-salt -hash');
        return res.json({ message: 'Profile updated', user });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update profile', error });
    }
});

export default router;

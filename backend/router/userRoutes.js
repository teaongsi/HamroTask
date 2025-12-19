import express from 'express';
import User from '../models/userSchema.js';
import { isAuthenticated } from '../middleware/auth.js';
import { upload, processImageUpload } from '../utils/imageUpload.js';

const router = express.Router();

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
        
        if (typeof skills === 'string') {
            try {
                update.skills = JSON.parse(skills);
            } catch {
                update.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
            }
        } else if (Array.isArray(skills)) {
            update.skills = skills;
        }
        
        if (req.file) {
            const imageUrl = await processImageUpload(req, 'profilePics');
            if (imageUrl) {

                const currentUser = await User.findById(req.user._id);
                if (currentUser?.profilePicture && !currentUser.profilePicture.startsWith('http')) {
                }
                update.profilePicture = imageUrl;
            }
        }
        
        const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-salt -hash');
        return res.json({ message: 'Profile updated', user });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update profile', error });
    }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        const userId = req.params.id;
        if (userId === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
    }
});

export default router;

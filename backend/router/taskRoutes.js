import express from 'express';
import Task from '../models/taskSchema.js';
import { isAuthenticated } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads/tasks'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

const router = express.Router();

// Get tasks assigned to the current user (tasker)
router.get('/assigned', isAuthenticated, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id, status: { $in: ['in progress', 'completed'] } })
            .populate('postedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assigned tasks', error });
    }
});

// Admin-only: get all tasks
router.get('/all', isAuthenticated, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        const tasks = await Task.find()
            .populate('postedBy', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks', error });
    }
});

// Get all tasks (public)
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ status: 'open' })
            .populate('postedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks', error });
    }
});

// Get my tasks (authenticated)
router.get('/my', isAuthenticated, async (req, res) => {
    try {
        const tasks = await Task.find({ postedBy: req.user._id })
            .populate('assignedTo', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch my tasks', error });
    }
});

// Create new task
router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, budget, location } = req.body;
        if (!title || !description || !category || !budget || !req.file) {
            console.error('Task creation validation failed:', {
                title, description, category, budget, file: req.file
            });
            return res.status(400).json({ message: 'Title, description, category, budget, and image are required' });
        }

        const newTask = new Task({
            title,
            description,
            category,
            budget,
            location,
            image: `/uploads/tasks/${req.file.filename}`,
            postedBy: req.user._id
        });

        await newTask.save();
        await newTask.populate('postedBy', 'firstName lastName email');
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Failed to create task:', error);
        res.status(500).json({ message: 'Failed to create task', error: error.message, stack: error.stack });
    }
});

// Update task
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { title, description, category, budget, location, status } = req.body;
        
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only the task owner can update
        if (task.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (budget !== undefined) updateData.budget = budget;
        if (location !== undefined) updateData.location = location;
        if (status !== undefined) updateData.status = status;

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('postedBy', 'firstName lastName email')
         .populate('assignedTo', 'firstName lastName email');

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task', error });
    }
});

// Delete task
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only the task owner can delete
        if (task.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task', error });
    }
});

// Get single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('postedBy', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email');
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch task', error });
    }
});

export default router;

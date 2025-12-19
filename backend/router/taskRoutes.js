import express from 'express';
import Task from '../models/taskSchema.js';
import { isAuthenticated } from '../middleware/auth.js';
import { upload, processImageUpload } from '../utils/imageUpload.js';

const router = express.Router();

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

router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, budget, location } = req.body;
        if (!title || !description || !category || !budget || !req.file) {
            console.error('Task creation validation failed:', {
                title, description, category, budget, file: req.file
            });
            return res.status(400).json({ message: 'Title, description, category, budget, and image are required' });
        }

        const imageUrl = await processImageUpload(req, 'tasks');
        if (!imageUrl) {
            return res.status(400).json({ message: 'Failed to upload image' });
        }

        const newTask = new Task({
            title,
            description,
            category,
            budget: parseFloat(budget),
            location,
            image: imageUrl,
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

router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { title, description, category, budget, location, status } = req.body;
        
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

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

router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task', error });
    }
});

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

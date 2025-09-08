import express from 'express';
import Applicant from '../models/applicantSchema.js';
import Task from '../models/taskSchema.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Apply to a task
router.post('/:taskId/apply', isAuthenticated, async (req, res) => {
    try {
        const { message } = req.body;
        const { taskId } = req.params;

        // Check if task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user already applied
        const existingApplication = await Applicant.findOne({
            task: taskId,
            applicant: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied to this task' });
        }

        // Create application
        const application = new Applicant({
            applicant: req.user._id,
            task: taskId,
            message: message || ''
        });

        await application.save();
        await application.populate('applicant', 'firstName lastName email');

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Failed to apply to task', error });
    }
});

// Get my applications
router.get('/my', isAuthenticated, async (req, res) => {
    try {
        const applications = await Applicant.find({ applicant: req.user._id })
            .populate('task', 'title description budget status')
            .sort({ createdAt: -1 });
        
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch applications', error });
    }
});

// Get applicants for my tasks (clients only)
router.get('/task/:taskId', isAuthenticated, async (req, res) => {
    try {
        const { taskId } = req.params;

        // Verify task ownership
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view applicants' });
        }

        const applicants = await Applicant.find({ task: taskId })
            .populate('applicant', 'firstName lastName email bio skills')
            .sort({ createdAt: -1 });

        res.json(applicants);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch applicants', error });
    }
});

// Accept/Reject applicant
router.put('/:applicationId', isAuthenticated, async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await Applicant.findById(applicationId)
            .populate('task');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify task ownership
        if (application.task.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update application status
        application.status = status;
        await application.save();

        // If accepted, assign task to applicant
        if (status === 'accepted') {
            await Task.findByIdAndUpdate(application.task._id, {
                assignedTo: application.applicant,
                status: 'in progress'
            });
        }

        await application.populate('applicant', 'firstName lastName email');

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update application', error });
    }
});

export default router;

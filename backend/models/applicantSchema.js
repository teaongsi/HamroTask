import { Schema, model } from "mongoose";

const ApplicantSchema = new Schema({
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true 
    },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

export default model('Applicant', ApplicantSchema);
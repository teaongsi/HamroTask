import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    taskId: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewedFor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String
    }
}, { timestamps: true });

export default model('Review', reviewSchema);
import { Schema, model } from "mongoose";

const offerSchema = new Schema({
    taskId: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offerAmount: {
        type: Number,
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

export default model('Offer', offerSchema);
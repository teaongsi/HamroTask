import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['client', 'taker', 'admin'],
        default: 'client'
    },
    location: {
        type: String
    },
    skills: {
        type: [String]
    },
    bio: {
        type: String
    }
}, { timestamps: true });

export default model('User', userSchema);
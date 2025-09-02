import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
    },
    role: {
        type: String,
        enum: ['client', 'tasker', 'admin'],
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

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
export default model('User', userSchema);
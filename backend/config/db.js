import mongoose from 'mongoose';
import 'dotenv/config';

const dbURI = process.env.DBURI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
  }
};

export default connectDB;
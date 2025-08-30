import express from 'express';
import connectDB from './config/db.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 8000;

const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer();


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import razorpayRoutes from './routes/razorpay.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON
app.use(cookieParser());
app.use(bodyParser.json()); // Middleware for parsing JSON

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/razorpay', razorpayRoutes);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and Start Server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit the process if DB connection fails
    }
};

startServer();
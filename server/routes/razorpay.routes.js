import express from "express";
import { subscription } from "../controllers/razorpay.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Endpoint to create a subscription
router.post("/subscription", verifyToken, subscription);

export default router;
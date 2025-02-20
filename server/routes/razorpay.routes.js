import express from "express";
import Razorpay from "razorpay";
import { subscription } from "../controllers/razorpay.controller.js";

const router = express.Router();

// Razorpay configuration
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Endpoint to create a subscription
router.post("/create-subscription", subscription);

export default router;
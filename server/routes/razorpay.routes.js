import express from "express";
import { subscription } from "../controllers/razorpay.controller.js";

const router = express.Router();

// Endpoint to create a subscription
router.post("/create-subscription", subscription);

export default router;
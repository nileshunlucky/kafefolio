import User from "../models/user.model.js";
import instance from "../configs/razorpay.js";

export const subscription = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a Razorpay subscription
        let subscription = await instance.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID, // Replace with your Razorpay Plan ID
            customer_notify: 1, // Notify the customer on subscription creation
            total_count: null, // make it 1 month subscription
        });

        res.json({ subscription });
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ error: "Failed to create subscription" });
    }
}
import User from "../models/user.model.js";
import instance from "../configs/razorpay.js";

export const subscription = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a Razorpay subscription
        const subscription = await instance.subscriptions.create({
            plan_id: "plan_PxrXNDPwIr9xae", // Replace with your Razorpay Plan ID
            customer_notify: 1, // Notify the customer on subscription creation
            total_count: 12, // Null indicates an ongoing subscription
        });

        res.json({ subscription });
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ error: "Failed to create subscription" });
    }
}
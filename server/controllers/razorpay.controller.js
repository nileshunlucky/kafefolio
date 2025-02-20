export const subscription = async (req, res) => {
    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id: "plan_PxrXNDPwIr9xae", // Replace with your Razorpay Plan ID
            customer_notify: 1, // Notify the customer on subscription creation
            total_count: null, // Number of billing cycles (optional, set null for ongoing)
        });


        res.json({ subscription });
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ error: "Failed to create subscription" });
    }
}
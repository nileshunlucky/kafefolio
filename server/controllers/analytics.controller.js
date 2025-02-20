import mongoose from "mongoose"; // Import mongoose
import Analytics from "../models/analytics.model.js"; // Mongoose model for analytics

export const userAnalytics = async (req, res) => {
    try {
        const { user } = req.params;

        // Validate the user ID format
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Query analytics for the user
        const analytics = await Analytics.find({ user: new mongoose.Types.ObjectId(user) }) // Use 'new' here
            .sort({ timestamp: -1 });

        res.status(200).json(analytics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch analytics data" });
    }
}

export const userTrack = async (req, res) => {
    try {
        const { eventType, user, details, timestamp, platform } = req.body;
        console.log(req.body);
        console.log("Platform", platform);

        // Validate the user ID format
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Save the event in the database
        const analyticsEvent = new Analytics({
            user: new mongoose.Types.ObjectId(user), // Use 'new' here as well
            eventType,
            details: details || {}, // Default to empty object if not provided
            platform,
            timestamp: timestamp || Date.now(), // Use current time if not provided
        });

        await analyticsEvent.save();

        res.status(201).json({ message: "Event tracked successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to track event" });
    }
}
import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventType: { type: String, required: true }, // e.g., 'page_view', 'image_click'
    details: { type: Object, default: {} }, // Additional info, e.g., clicked image ID
    platform: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
});

const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);

export default Analytics;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    profilePic: { type: String, default: "https://cdn-icons-png.flaticon.com/512/13078/13078067.png" },
    isPro: { type: Boolean, default: false },
    bio: { type: String, default: "" },
    category: { type: String, default: "" },
    links: [
        {
            text: { type: String, required: true },
            url: { type: String, required: true }
        }
    ],
    social: {
        type: Object, default: {
            facebook: "",
            X: "",
            instagram: "",
            threads: "",
            snapchat: "",
            youtube: "",
            linkedIn: "",
        }
    },
    portfolio: {
        template: { type: String, default: "Classic" },
        media: { type: [String], default: [] },
        theme: {
            color: { type: String, default: "#000" },
            backgroundColor: { type: String, default: "#f4f4f4" },
            font: { type: String, default: "Poppins" },
        }
    },
    about: {
        image: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        resume: { type: String, default: "" },
    },
    subscription: [
        {
            transactionId: { type: String, default: "" },
            amount: { type: Number, default: 0 },
            method: { type: String, default: "" },
            transactionDate: { type: Date, default: Date.now },
        },
    ]
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
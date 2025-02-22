import User from "../models/user.model.js";

// Get Single User Profile (Protected)
export const UserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie('token'); // Clear the cookie
    res.json({ message: "Logout successful" });
};

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateUser = async (req, res) => {
    try {

        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.body.username) {
            // Check if username contains emojis
            const regexEmoji = /\p{Extended_Pictographic}/u;
            if (regexEmoji.test(req.body.username)) {
                return res.status(400).json({ message: "Username cannot contain emoji" });
            }

            // Check if username contains only allowed characters (letters, numbers, ".", "_")
            const regexUsername = /^[a-zA-Z0-9._]+$/;
            if (!regexUsername.test(req.body.username)) {
                return res.status(400).json({ message: "Username cannot contain special characters except . and _" });
            }

            // Check if username is not longer than 20 characters
            if (req.body.username.length > 20) {
                return res.status(400).json({ message: "Username cannot be longer than 20 characters" });
            }
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const userPortfolio = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user portfolio:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const uploadProfilePic = async (req, res) => {
    try {
        const imageUrl = req.file.path;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        user.profilePic = imageUrl;
        await user.save();

        res.json({ message: "Image uploaded successfully" });

    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const portfolioPost = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const mediaUrl = req.file.path; // Cloudinary URL
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Restrict free users from uploading videos
        if (!user.isPro && req.file.mimetype.startsWith("video/")) {
            return res.status(403).json({ message: "Upgrade to Pro to upload videos." });
        }

        // Ensure `portfolio.media` exists and add new file
        if (!user.portfolio.media) {
            user.portfolio.media = [];
        }
        user.portfolio.media.push(mediaUrl);

        await user.save();

        res.json({ message: "Upload successful", url: mediaUrl });

    } catch (error) {
        console.error("Error uploading media:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deletePortfolioPost = async (req, res) => {
    try {
        const { mediaUrl } = req.body; // Get the image URL from the request body
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove the image from the user's portfolio
        user.portfolio.media = user.portfolio.media.filter(
            (media) => media !== mediaUrl
        );

        await user.save();

        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const aboutUser = async (req, res) => {
    try {
        const imageUrl = req.file.path;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.about.image = imageUrl;
        await user.save();

        res.json({ message: "Image uploaded successfully" });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const aboutMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the 'about' field in the user document
        user.about = req.body;

        // Save the updated user to the database
        await user.save();

        res.json({ message: "About Me updated successfully", about: user.about });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const activePro = async (req, res) => {

    try {
        const { payment_id, amount, method } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // update the 'subscription' field in the user document
        user.subscription = { transactionId: payment_id, amount, method , transactionDate: new Date() };

        // Update the 'isPro' field in the user document
        user.isPro = true;
        await user.save();

        res.json(user); // Send the updated user data
    } catch (error) {
        console.error("Error updating subscription status:", error);
        res.status(500).json({ message: error.message });
    }
}
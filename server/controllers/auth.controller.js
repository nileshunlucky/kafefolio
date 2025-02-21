import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// This function generates the token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
    let { name, email, password } = req.body;
    email = email.toLowerCase(); // Ensure email consistency

    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        let baseUsername = name.toLowerCase().replace(/\s+/g, "").trim();
        let username = baseUsername;
        let count = 1;

        while (await User.findOne({ username })) {
            username = `${baseUsername}${count}`;
            count++;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, username, profilePic: "https://cdn-icons-png.flaticon.com/512/13078/13078067.png" });
        await user.save();

        const token = generateToken(user._id);

        // Set token in cookies (httpOnly and secure if in production)
        res.cookie('token', token, {
            httpOnly: true,   // Cannot be accessed by JS (More Secure)
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase();

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id);

        // Set token in cookies (httpOnly and secure if in production)
        res.cookie('token', token, {
            httpOnly: true,   // Cannot be accessed by JS (More Secure)
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const googleAuth = async (req, res) => {
    try {
        let { email, name } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        email = email.toLowerCase();

        // Define username based on email if not provided
        let username = name ? name.toLowerCase().replace(/\s+/g, "") : email.split('@')[0];

        // Find user by email
        let user = await User.findOne({ email });

        if (!user) {
            // If user does not exist, create a new one
            const randomPassword = bcrypt.hashSync(Math.random().toString(36).slice(-8), 10);
            user = new User({
                name,
                email,
                password: randomPassword,
                username,
            });
            await user.save();
        }

        // Generate JWT token
        const jwtToken = generateToken(user._id);

        // Set token in cookies (httpOnly and secure if in production)
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Respond with the token and user info
        res.json({ token: jwtToken, user });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


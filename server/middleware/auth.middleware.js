import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Extract token from Authorization header or cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token. Please log in again." });
    }
};

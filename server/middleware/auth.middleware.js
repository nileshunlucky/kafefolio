import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    console.log("Cookies received:", req.cookies);
    console.log(req);

    const token = req.cookies.token; // Access token from cookies

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. Redirect to login." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token. Redirect to login." });
    }
};

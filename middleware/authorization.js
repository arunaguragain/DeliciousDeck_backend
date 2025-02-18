const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Assuming token is passed as "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: 'No token provided, access denied' });
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, 'your_jwt_secret_key');  // Replace with your actual secret key
        req.user = decoded;  // Attach user data to the request
        next();  // Proceed to the next middleware/route handler
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;

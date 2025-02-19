const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the Authorization header

        // If there's no token, deny access
        if (!token) {
            return res.status(403).json({ message: 'No token provided, access denied' });
        }

        try {
            // Decode the token
            const decoded = jwt.verify(token, 'your_jwt_secret_key');
            req.user = decoded;

            // Ensure the user has a role
            if (!req.user.role) {
                return res.status(403).json({ message: 'Role not assigned, access denied' });
            }

            // Check if the user's role matches the required role(s)
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Continue to the next middleware or route handler
            next();
        } catch (err) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};

module.exports = authMiddleware;

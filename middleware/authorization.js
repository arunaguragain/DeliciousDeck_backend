const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1]; 

        if (!token) {
            return res.status(403).json({ message: 'No token provided, access denied' });
        }

        try {
            const decoded = jwt.verify(token, 'your_jwt_secret_key');
            req.user = decoded;

            if (!req.user.role) {
                return res.status(403).json({ message: 'Role not assigned, access denied' });
            }

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            next();
        } catch (err) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};

module.exports = authMiddleware;

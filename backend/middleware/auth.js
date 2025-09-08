export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) return next();
    return res.status(401).json({ message: "Not authenticated" });
    };

export const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
};
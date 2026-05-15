const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt');
const user = require('../models/user')

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            result: false,
            message: "You need to login."
        });
    }

    // bom bek string tv jea array
    let parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            result: false,
            message: "Invalid token"
        });
    }

    const token = parts[1];
    const userInfo = await user.checkToken(token);
    if (userInfo.length === 0) {
        return res.status(401).json({
            result: false,
            message: "Invalid token or expide"
        });
    }
    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = authMiddleware;
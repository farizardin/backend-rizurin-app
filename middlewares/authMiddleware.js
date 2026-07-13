const jwt = require('jsonwebtoken');
const BaseOutput = require('../outputs/BaseOutput');

const authMiddleware = (req, res, next) => {
    // 1. Support gateway headers injected by Traefik
    const gatewayUserId = req.headers['x-user-id'];
    if (gatewayUserId) {
        req.user = {
            id: parseInt(gatewayUserId, 10),
            email: req.headers['x-user-email'],
            role: req.headers['x-user-role'] || 'user',
            name: req.headers['x-user-name']
        };
        return next();
    }

    // 2. Fall back to direct JWT token verification (for local testing/direct requests)
    let token = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json(BaseOutput.error(null, 'Unauthorized: No token provided', 401));
    }

    try {
        const publicKey = process.env.CASDOOR_JWT_PUBLIC_KEY;

        if (publicKey) {
            let formattedPublicKey = publicKey.replace(/\\n/g, '\n');
            if (!formattedPublicKey.includes('-----BEGIN')) {
                formattedPublicKey = `-----BEGIN CERTIFICATE-----\n${formattedPublicKey}\n-----END CERTIFICATE-----`;
            }

            let decoded;
            try {
                decoded = jwt.verify(token, formattedPublicKey, { algorithms: ['RS256'] });
            } catch (err) {
                decoded = jwt.verify(token, process.env.JWT_SECRET || 'rizurin_super_secret_jwt_key_for_user_service');
            }

            req.user = {
                id: decoded.id || decoded.name,
                email: decoded.email || decoded.emailAddress,
                role: decoded.role || 'user',
                name: decoded.displayName || decoded.name
            };
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rizurin_super_secret_jwt_key_for_user_service');
            req.user = decoded;
        }
        next();
    } catch (err) {
        return res.status(401).json(BaseOutput.error(null, 'Unauthorized: Invalid or expired token', 401));
    }
};

module.exports = authMiddleware;

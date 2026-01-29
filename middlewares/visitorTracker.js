const { Visitor } = require('../models');

const visitorTracker = async (req, res, next) => {
    try {
        // Skip tracking for health checks and stats endpoints
        const excludedPaths = ['/health', '/index/stats', '/stats'];
        if (excludedPaths.some(path => req.path.includes(path))) {
            return next();
        }

        // Helper to normalize IP
        const normalizeIp = (ipStr) => {
            return ipStr ? ipStr.split(',')[0].trim() : null;
        };

        // Prioritize X-Forwarded-For (standard for proxies)
        // Then X-Real-IP (often used by Nginx/Traefik)
        let ip = normalizeIp(req.headers['x-forwarded-for']) ||
            normalizeIp(req.headers['x-real-ip']) ||
            req.ip ||
            req.connection.remoteAddress;

        // Log headers for debugging (temporary)
        console.log(`[VisitorTracker] Client IP: ${ip}`);
        console.log(`[VisitorTracker] Headers: x-forwarded-for=${req.headers['x-forwarded-for']}, x-real-ip=${req.headers['x-real-ip']}`);

        if (ip) {
            const [visitor, created] = await Visitor.findOrCreate({
                where: { ip },
                defaults: { visit_count: 1 }
            });

            if (!created) {
                await visitor.increment('visit_count');
            }
        }

        next();
    } catch (error) {
        console.error('Error in visitorTracker:', error);
        next();
    }
};

module.exports = visitorTracker;

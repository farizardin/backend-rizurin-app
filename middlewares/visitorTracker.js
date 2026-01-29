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

        // Prioritize CF-Connecting-IP (Cloudflare)
        // Then X-Forwarded-For (standard for proxies)
        // Then X-Real-IP (often used by Nginx/Traefik)
        let ip = normalizeIp(req.headers['cf-connecting-ip']) ||
            normalizeIp(req.headers['x-forwarded-for']) ||
            normalizeIp(req.headers['x-real-ip']) ||
            req.ip ||
            req.connection.remoteAddress;

        // Log headers for debugging (temporary)
        console.log(`[VisitorTracker] Client IP: ${ip}`);
        // Log keys to see what we actually have
        console.log(`[VisitorTracker] All Headers: ${JSON.stringify(req.headers)}`);

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

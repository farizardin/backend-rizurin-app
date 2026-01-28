const { Visitor } = require('../models');

const visitorTracker = async (req, res, next) => {
    try {
        // Skip tracking for health checks and stats endpoints
        const excludedPaths = ['/health', '/index/stats', '/stats'];
        if (excludedPaths.some(path => req.path.includes(path))) {
            return next();
        }

        // Prioritize X-Forwarded-For for testing and reverse proxies.
        const ip = req.headers['x-forwarded-for'] ||
            req.ip ||
            req.connection.remoteAddress;

        if (ip) {
            const [visitor, created] = await Visitor.findOrCreate({
                where: { ip },
                defaults: { visitCount: 1 }
            });

            if (!created) {
                await visitor.increment('visitCount');
            }
        }

        next();
    } catch (error) {
        console.error('Error in visitorTracker:', error);
        next();
    }
};

module.exports = visitorTracker;

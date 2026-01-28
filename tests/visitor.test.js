const request = require('supertest');
const App = require('../app');
const { Visitor } = require('../models');

const appInstance = new App();
const app = appInstance.app;

describe('Visitor Tracking', () => {
    beforeEach(async () => {
        // Clear visitors table before each test
        await Visitor.destroy({ where: {}, truncate: true, cascade: true });
    });

    it('should create a new visitor record on the first visit', async () => {
        const res = await request(app)
            .get('/index')
            .set('X-Forwarded-For', '1.2.3.4'); // Mocking IP address

        expect(res.statusCode).toEqual(200);

        const visitor = await Visitor.findOne({ where: { ip: '1.2.3.4' } });
        expect(visitor).not.toBeNull();
        expect(visitor.visit_count).toEqual(1);
    });

    it('should increment visit_count for existing visitors', async () => {
        // Initial visit
        await request(app)
            .get('/index')
            .set('X-Forwarded-For', '1.2.3.4');

        // Second visit
        await request(app)
            .get('/index')
            .set('X-Forwarded-For', '1.2.3.4');

        const visitor = await Visitor.findOne({ where: { ip: '1.2.3.4' } });
        expect(visitor.visit_count).toEqual(2);
    });

    it('should return correct total unique visitors in /index/stats', async () => {
        // Visitor 1
        await request(app)
            .get('/index')
            .set('X-Forwarded-For', '1.1.1.1');

        // Visitor 2
        await request(app)
            .get('/index')
            .set('X-Forwarded-For', '2.2.2.2');

        // Repeat visit from Visitor 1
        await request(app)
            .get('/index')
            .set('X-Forwarded-For', '1.1.1.1');

        const res = await request(app).get('/index/stats');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.totalVisitors).toEqual(2);
        console.log(res.body);
    });

    it('should NOT track visits to excluded paths (stats, health)', async () => {
        // Initial count
        const initialStats = await request(app).get('/index/stats');
        const initialCount = initialStats.body.data.totalVisitors;

        // Visit excluded path
        await request(app)
            .get('/index/stats')
            .set('X-Forwarded-For', '3.3.3.3');

        await request(app)
            .get('/health')
            .set('X-Forwarded-For', '4.4.4.4');

        const finalStats = await request(app).get('/index/stats');
        expect(finalStats.body.data.totalVisitors).toEqual(initialCount);
    });

    it('should fallback to remoteAddress if X-Forwarded-For is missing', async () => {
        const res = await request(app)
            .get('/index'); // No header set

        expect(res.statusCode).toEqual(200);

        // Supertest usually sets a default remote address or we get ::ffff:127.0.0.1
        const visitorCount = await Visitor.count();
        expect(visitorCount).toBeGreaterThan(0);
    });
});

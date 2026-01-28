const request = require('supertest');
const App = require('../app');
const { User } = require('../models');

const appInstance = new App();
const app = appInstance.app;

describe('Auth Endpoints', () => {
    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data).toHaveProperty('username', 'testuser');
            expect(res.body.data).toHaveProperty('email', 'test@example.com');
        });

        it('should not register a user with existing email', async () => {
            await User.create({ username: 'existinguser', email: 'test@example.com', password: 'password123' });
            const res = await request(app)
                .post('/auth/register')
                .send({
                    username: 'newuser',
                    email: 'test@example.com',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                });
        });

        it('should login with valid email', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    login: 'test@example.com',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data).toHaveProperty('expires_in', 3600);
            expect(res.body.data.user).toHaveProperty('username', 'testuser');
        });

        it('should login with valid username', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    login: 'testuser',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data).toHaveProperty('expires_in', 3600);
            expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
        });

        it('should not login with invalid password', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    login: 'test@example.com',
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toEqual(401);
        });
    });
});

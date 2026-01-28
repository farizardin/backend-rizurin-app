const BaseController = require('./BaseController');
const AuthService = require('../services/AuthService');

class AuthController extends BaseController {
    async register() {
        const { username, email, password } = this.req.body;
        const authService = new AuthService();
        const user = await authService.register({ username, email, password });
        this.res.status(201);
        return this.output().toJson(
            { id: user.id, username: user.username, email: user.email },
            'User registered successfully'
        );
    }

    async login() {
        const { login, password } = this.req.body;
        const authService = new AuthService();
        const token = await authService.login(login, password);
        return this.output().toJson(
            { token },
            'Login successful'
        );
    }
}

module.exports = AuthController;

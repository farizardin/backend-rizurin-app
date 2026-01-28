const BaseController = require('./BaseController');
const AuthService = require('../services/AuthService');
const UserOutput = require('../outputs/UserOutput');
const AuthOutput = require('../outputs/AuthOutput');

class AuthController extends BaseController {
    async register() {
        const { username, email, password } = this.req.body;
        const authService = new AuthService();
        const user = await authService.register({ username, email, password });
        this.res.status(201);
        return this.output().toJson(
            user,
            'User registered successfully',
            UserOutput,
            'userBasicOutput'
        );
    }

    async login() {
        const { login, password } = this.req.body;
        const authService = new AuthService();
        const data = await authService.login(login, password);
        return this.output().toJson(
            data,
            'Login successful',
            AuthOutput,
            'authWithUserOutput'
        );
    }
}

module.exports = AuthController;

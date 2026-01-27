const BaseRoutes = require('./BaseRoutes');
const CONTROLLERS = require('../controllers');

class AuthRoutes extends BaseRoutes {
    constructor() {
        super();
    }

    registerRoutes() {
        this.router.post('/register', this.handle(CONTROLLERS.AuthController, 'register'));
        this.router.post('/login', this.handle(CONTROLLERS.AuthController, 'login'));
    }
}

module.exports = AuthRoutes;

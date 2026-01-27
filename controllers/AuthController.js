const BaseController = require('./BaseController');
const { User, Sequelize } = require('../models');
const { Op } = Sequelize;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthorizedError');

class AuthController extends BaseController {
    async register() {
        const { username, email, password } = this.req.body;
        const user = await User.create({ username, email, password });

        const output = new this.out('success', 201, 'User registered successfully', { id: user.id, username: user.username, email: user.email });
        return this.res.status(201).json(output.asJson());
    }

    async login() {
        const { login, password } = this.req.body;
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: login },
                    { username: login }
                ]
            }
        });
        if (!user) {
            throw new UnauthorizedError('Invalid login or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedError('Invalid login or password');
        }
        const token = jwt.sign({ id: user.id, email: user.email }, 'secret_key', { expiresIn: '1h' });

        return this.output().toJson(
            { token },
            'Login successful'
        );
    }
}

module.exports = AuthController;

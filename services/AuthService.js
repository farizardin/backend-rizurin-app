const { User } = require('../models');
const UnauthorizedError = require('../errors/UnauthorizedError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const BaseService = require('./BaseService');

class AuthService extends BaseService {
    constructor() {
        super();
    }

    async register(data) {
        const user = await User.create(data);
        return user;
    }

    async login(login, password) {
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

        return token;
    }
}

module.exports = AuthService;

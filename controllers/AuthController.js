const BaseController = require('./BaseController');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController extends BaseController {
    async register() {
        try {
            const { email, password } = this.req.body;
            const user = await User.create({ email, password });

            const output = new this.out('success', 201, 'User registered successfully', { id: user.id, email: user.email });
            // Use res.status().json() directly because BaseOutput.toJson() doesn't support custom status code easily with the current BaseController helper
            return this.res.status(201).json(output.asJson());
        } catch (error) {
            return this.output().error({ error: error.message }, 'Registration failed', 400);
        }
    }

    async login() {
        try {
            const { email, password } = this.req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return this.output().error({ error: 'Invalid email or password' }, 'Login failed', 401);
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return this.output().error({ error: 'Invalid email or password' }, 'Login failed', 401);
            }
            const token = jwt.sign({ id: user.id, email: user.email }, 'secret_key', { expiresIn: '1h' });

            return this.output().toJson(
                { token },
                'Login successful'
            );
        } catch (error) {
            return this.output().error({ error: error.message }, 'Login failed', 500);
        }
    }
}

module.exports = AuthController;

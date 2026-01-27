const AppError = require('./AppError');

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', data = null) {
        super(message, 401, data);
    }
}

module.exports = UnauthorizedError;

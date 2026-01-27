const AppError = require('./AppError');

class NotFoundError extends AppError {
    constructor(message = 'Resource Not Found', data = null) {
        super(message, 404, data);
    }
}

module.exports = NotFoundError;

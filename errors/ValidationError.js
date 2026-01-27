const AppError = require('./AppError');

class ValidationError extends AppError {
    constructor(message = 'Validation Error', data = null) {
        super(message, 400, data);
    }
}

module.exports = ValidationError;

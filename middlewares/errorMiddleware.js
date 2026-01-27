const BaseOutput = require('../outputs/BaseOutput');
const AppError = require('../errors/AppError');

const errorMiddleware = (err, req, res, next) => {
    let code = 500;
    let message = 'Internal Server Error';
    let data = null;

    if (err instanceof AppError) {
        code = err.code;
        message = err.message;
        data = err.data;
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        code = 400;
        message = 'Duplicate entry detected';
        data = err.errors.map(e => ({ field: e.path, message: e.message }));
    } else {
        // Log unexpected errors
        console.error(`[Error] ${err.name}: ${err.message}`, err.stack);
    }

    return res.status(code).json(BaseOutput.error(data, message, code));
};

module.exports = errorMiddleware;

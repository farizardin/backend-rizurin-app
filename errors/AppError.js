class AppError extends Error {
    constructor(message, code = 500, data = null) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;

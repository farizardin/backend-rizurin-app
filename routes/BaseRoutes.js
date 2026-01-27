class BaseRoutes {
  constructor() {
    this.router = require('express').Router();
    this.registerRoutes();
  }

  handle(ControllerClass, methodName) {
    return async (req, res, next) => {
      try {
        const controller = new ControllerClass();
        controller.setRequest(req, res, next);

        if (typeof controller[methodName] !== 'function') {
          return res.status(500).json({ error: 'Invalid controller method' });
        }
        return await controller[methodName]();
      } catch (err) {
        next(err);
      }
    };
  }
}

module.exports = BaseRoutes;

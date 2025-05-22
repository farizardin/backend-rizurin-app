class BaseRoutes {
  handle(ControllerClass, methodName) {
    return (req, res) => {
      const controller = new ControllerClass();
      controller.setRequest(req, res);

      if (typeof controller[methodName] !== 'function') {
        return res.status(500).json({ error: 'Invalid controller method' });
      }
      return controller[methodName]();
    };
  }
}

module.exports = BaseRoutes;

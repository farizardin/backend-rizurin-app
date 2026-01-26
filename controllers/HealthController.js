const BaseController = require('./BaseController');

class HealthController extends BaseController {
  index() {
    // simple health check
    const data = { status: 'ok', timestamp: new Date().toISOString() };
    this.res.status(200).json(data);
  }
}

module.exports = HealthController;

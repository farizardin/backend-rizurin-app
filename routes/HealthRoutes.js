const express = require('express');
const BaseRoutes = require('./BaseRoutes');
const CONTROLLERS = require('../controllers');

class HealthRoutes extends BaseRoutes {
  constructor() {
    super();
  }

  registerRoutes() {
    this.router.get('/', this.handle(CONTROLLERS.HealthController, 'index'));
  }
}

module.exports = HealthRoutes;

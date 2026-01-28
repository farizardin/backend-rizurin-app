const express = require('express');
const BaseRoutes = require('./BaseRoutes');
const CONTROLLERS = require('../controllers');

class HomeRoutes extends BaseRoutes {
  constructor() {
    super();
  }

  registerRoutes() {
    this.router.get('/', this.handle(CONTROLLERS.HomeController, 'index'));
    this.router.get('/stats', this.handle(CONTROLLERS.HomeController, 'stats'));
  }
}

module.exports = HomeRoutes;

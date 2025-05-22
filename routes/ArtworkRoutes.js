const express = require('express');
const BaseRoutes = require('./BaseRoutes');
const CONTROLLERS = require('../controllers');

class ArtworkRoutes extends BaseRoutes {
  constructor() {
    super();
  }

  registerRoutes() {
    this.router.get('/', this.handle(CONTROLLERS.endusers.ArtworkController, 'getHello'));
  }
}

module.exports = ArtworkRoutes;

const express = require('express');
const IndexController = require('../controllers/IndexController');
const BaseRoutes = require('./BaseRoutes');

class IndexRoutes extends BaseRoutes {
  constructor() {
    super();
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/', this.handle(IndexController, 'getHello'));
  }
}

module.exports = IndexRoutes;

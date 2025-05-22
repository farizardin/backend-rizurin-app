
const express = require('express');
const ROUTES = require('./routes');

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use('/api/artworks', new ROUTES.ArtworkRoutes().router);
  }

  listen(port, callback) {
    this.app.listen(port, callback);
  }
}

module.exports = App;

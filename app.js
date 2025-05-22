
const express = require('express');
const IndexRoutes = require('./routes/IndexRoutes');

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
    this.app.use('/api/hello', new IndexRoutes().router);
  }

  listen(port, callback) {
    this.app.listen(port, callback);
  }
}

module.exports = App;

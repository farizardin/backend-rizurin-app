
const express = require('express');
const cors = require('cors');
const ROUTES = require('./routes');

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Konfigurasi CORS untuk mengizinkan akses dari frontend
    const corsOptions = {
      origin: [
        'https://rizurin.my.id',
        'http://rizurin.my.id',
        'http://localhost:3000', // untuk development
        'http://localhost:5173', // untuk vite development
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true, // Jika menggunakan cookies/session
    };
    
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
  }

  routes() {
    this.app.use('/index', new ROUTES.HomeRoutes().router);
    this.app.use('/health', new ROUTES.HealthRoutes().router);
  }

  listen(port, callback) {
    this.app.listen(port, callback);
  }
}

module.exports = App;

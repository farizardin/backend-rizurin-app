
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ROUTES = require('./routes');
const authMiddleware = require('./middlewares/authMiddleware');

class App {
  constructor() {
    this.app = express();
    this.app.set('trust proxy', true);
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Konfigurasi CORS untuk mengizinkan akses dari frontend
    const corsOptions = {
      origin: [
        'https://rizurin.my.id',
        'http://rizurin.my.id',
        'http://localhost:3002',
        'http://localhost:3000', // untuk development
        'http://localhost:5173', // untuk vite development
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true, // Jika menggunakan cookies/session
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(require('./middlewares/visitorTracker'));
  }

  routes() {
    this.app.use('/index', new ROUTES.HomeRoutes().router);
    this.app.use('/health', new ROUTES.HealthRoutes().router);
    this.app.use('/auth', new ROUTES.AuthRoutes().router);
    this.app.use('/image-processing', new ROUTES.ImageProcessingRoutes().router);
    this.app.use('/project', new ROUTES.ProjectRoutes().router);

    this.app.get('/auth/me', authMiddleware, (req, res) => {
      res.json({ success: true, data: req.user });
    });


    // Global error handler must be last
    const errorMiddleware = require('./middlewares/errorMiddleware');
    this.app.use(errorMiddleware);
  }

  listen(port, callback) {
    this.app.listen(port, callback);
  }
}

module.exports = App;

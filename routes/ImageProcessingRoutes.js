const BaseRoutes = require('./BaseRoutes');
const CONTROLLERS = require('../controllers');

class ImageProcessingRoutes extends BaseRoutes {
    constructor() {
        super();
    }

    registerRoutes() {
        this.router.post('/compress', this.handle(CONTROLLERS.ImageProcessingController, 'compress'));
        this.router.post('/to-pdf', this.handle(CONTROLLERS.ImageProcessingController, 'toPdf'));
    }
}

module.exports = ImageProcessingRoutes;

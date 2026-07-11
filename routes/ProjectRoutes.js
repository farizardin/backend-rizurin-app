const BaseRoutes = require('./BaseRoutes');
const ProjectController = require('../controllers/ProjectController');

class ProjectRoutes extends BaseRoutes {
  registerRoutes() {
    this.router.get('/homelab', this.handle(ProjectController, 'getHomelabProjects'));
  }
}

module.exports = ProjectRoutes;

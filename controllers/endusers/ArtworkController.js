const BaseOutput = require("../../outputs/BaseOutput");
const BaseController = require("../BaseController");

class ArtController extends BaseController {
  getHello() {
    this.res.json(BaseOutput.toJson({}, 'Index controller!'));
  }
}

module.exports = ArtController;

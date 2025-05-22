const BaseOutput = require("../outputs/BaseOutput");
const BaseController = require("./BaseController");

class IndexController extends BaseController {
  getHello() {
    this.res.json(BaseOutput.toJson({}, 'Index controller!'));
  }
}

module.exports = IndexController;

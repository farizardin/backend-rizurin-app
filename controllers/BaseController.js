const BaseOutput = require("../outputs/BaseOutput");
class BaseController {
  constructor() {
    this.req = null;
    this.res = null;
    this.output = BaseOutput;
  }
  setRequest(req, res) {
    this.req = req;
    this.res = res;
  }

  outputClass() {
    return this.output;
  }
}

module.exports = BaseController;

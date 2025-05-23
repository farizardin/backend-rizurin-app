const BaseOutput = require("../outputs/BaseOutput");
class BaseController {
  constructor() {
    this.req = null;
    this.res = null;
    this.out = BaseOutput;
  }

  setRequest(req, res) {
    this.req = req;
    this.res = res;
    this.out.setResponse(this.res);
  }

  output() {
    return this.out;
  }
}

module.exports = BaseController;

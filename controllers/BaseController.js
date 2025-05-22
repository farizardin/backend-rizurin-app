class BaseController {
  constructor() {
    this.req = null;
    this.res = null;
  }
  setRequest(req, res) {
    this.req = req;
    this.res = res;
  }
}

module.exports = BaseController;

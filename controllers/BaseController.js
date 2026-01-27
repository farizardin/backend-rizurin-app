const BaseOutput = require("../outputs/BaseOutput");
class BaseController {
  constructor() {
    this.req = null;
    this.res = null;
    this.out = BaseOutput;
  }

  setRequest(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  output() {
    const res = this.res;
    // return adapter with per-request methods to avoid shared static response
    return {
      toJson: (data = {}, message = 'Success', clazz = null, func = null) => this.out.sendJson(res, data, message, clazz, func),
      toArray: (data = [], message = 'Success', clazz = null, func = null) => this.out.sendArray(res, data, message, clazz, func),
      success: (data = null, message = 'Success') => res.json(this.out.success(data, message)),
      error: (data = null, message = 'Error', code = 500) => res.status(code).json(this.out.error(data, message, code)),
    };
  }
}

module.exports = BaseController;

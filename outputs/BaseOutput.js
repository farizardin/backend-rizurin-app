class BaseOutput {
  static _res = null;

  constructor(status = 'success', code = 200, message = 'Success', data = null, pagination = null) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.code = code;
    this.pagination = pagination;
  }

  static success(data = null, message = 'Success') {
    return new this('success', 200, message, data).asJson();
  }

  static error(data = null, message = 'Error', code = 500) {
    if (parseInt(code) >= 600 || parseInt(code) < 200) {
      code = 500;
    }
    return new this('error', code, message, data).asJsonError();
  }

  static toJson(data = {}, message = 'Success', clazz = null, func = null) {
    let obj = data;
    if (clazz && func && typeof clazz[func] === 'function') {
      obj = clazz[func](data);
    }
    return this.getResponse().json(new this('success', 200, message, obj).asJson());
  }

  static toArray(data = [], message = 'Success', clazz = null, func = null) {
    const pagination = this.getPaginationProperties(data);
    let objArr = [];

    if (clazz && func && typeof clazz[func] === 'function') {
      objArr = data.map(d => clazz[func](d));
    } else {
      objArr = [...data];
    }

    return this.getResponse().json(new this('success', 200, message, objArr, pagination).asJson());
  }

  static getResponse() {
    return this._res;
  }

  static setResponse(res) {
    this._res = res;
  }

  asJson() {
    const result = {
      status: this.status,
      message: this.message,
      data: this.data,
      code: this.code,
    };
    if (this.pagination !== null) {
      result.pagination_metadata = this.pagination;
    }
    return result;
  }

  asJsonError() {
    const errorObj = {
      status: this.status,
      message: this.message,
      code: this.code,
      errors: typeof this.data?.getData === 'function' ? this.data.getData() : [],
    };

    if (process.env.APP_DEBUG === 'true' && typeof this.data?.getTrace === 'function') {
      errorObj.trace = this.data.getTrace();
    }

    return errorObj;
  }

  static getPaginationProperties(data) {
    if (typeof data !== 'object' || data === null) return null;

    const paginationMetaData = {};

    if (typeof data.currentPage === 'function') paginationMetaData.current_page = data.currentPage();
    if (typeof data.total === 'function') paginationMetaData.total = data.total();
    if (typeof data.perPage === 'function') paginationMetaData.per_page = data.perPage();
    if (typeof data.lastPage === 'function') paginationMetaData.last_page = data.lastPage();
    if (typeof data.nextPageUrl === 'function') paginationMetaData.next_page_url = data.nextPageUrl();
    if (typeof data.previousPageUrl === 'function') paginationMetaData.prev_page_url = data.previousPageUrl();

    return paginationMetaData;
  }
}

module.exports = BaseOutput;

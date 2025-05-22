class BaseOutputBackup {
  constructor(data, message, status = 'success', code = 200) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.code = code;
  }

  asJson() {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      data: this.data
    };
  }

  static toJson(data = {}, message = 'success', code = 200) {
    return new this(data, message, 'success', 200).asJson();
  }
}

module.exports = BaseOutputBackup;

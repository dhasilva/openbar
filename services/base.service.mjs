const { EventEmitter } = require('events');

export class BaseService {
  constructor(options = {}) {
    Object.assign(this, {
      lastData: null
    }, options);

    this.emitter = new EventEmitter();
  }

  async run() {}

  static instance = null;

  static getService() {
    if (this.instance) return this.instance;

    this.instance = new this();
    this.instance.run();
    return this.instance;
  }
}

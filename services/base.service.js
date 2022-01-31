// Node
import { EventEmitter } from 'events';

export default class BaseService {
  constructor(options = {}) {
    Object.assign(this, {
      lastData: null,

      autoStart: true
    }, options);

    this.emitter = new EventEmitter();
  }

  async run() {}

  static instance = null;

  static getService() {
    if (this.instance) return this.instance;

    this.instance = new this();
    if (this.instance.autoStart) this.instance.run();
    return this.instance;
  }
}

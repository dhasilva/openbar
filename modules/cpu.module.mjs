const { on } = require('events');

import BaseModule from './base.module.mjs';
import CPUService from '../services/cpu.service.mjs';

export default class CPUModule extends BaseModule {
  constructor(options = {}) {
    super(options);

    this.service = CPUService.getService();
  }

  async initialize() {
    this.readLast();

    this.listen();
  }

  async listen() {
    for await (const [data] of on(this.service.emitter, 'update')) {
      this.data = this.transform(data);
    }
  }

  readLast() {
    this.data = this.transform(this.service.lastData) || `󰍛 ---%`;
  }

  transform(data) {
    if (data === null) return;

    // const padded = `${' '.repeat(3 - data.length)}${data}`;
    return `󰍛 ${data}%`;
  }
}

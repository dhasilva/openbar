const { on } = require('events');

import BaseModule from './base.module.mjs';
import RAMService from '../services/ram.service.mjs';

export default class RAMModule extends BaseModule {
  constructor(options = {}) {
    super(options);

    this.service = RAMService.getService();
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
    this.data = this.transform(this.service.lastData) || '󰘚 --- (--%)';
  }

  transform(data) {
    if (data === null) return;

    const { total, available } = data;

    const used = total - available;
    const usedPercentage = Math.round(100 * used / total);

    const humanized = humanizeBytes(used, 1);

    // const magnitude = humanized.value.split('.')[0];
    // const padded = `${' '.repeat(3 - magnitude.length)}${humanized}`;

    return `󰘚 ${humanized} (${usedPercentage}%)`;
  }
}

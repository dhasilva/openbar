// Node
import { on } from 'events';

import { humanizeBytes } from '../functions.js';

// Base
import BaseModule from './base.module.js';

// Service
import RAMService from '../services/ram.service.js';

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

  get icon() {
    // Siji
    return '';
  }

  readLast() {
    this.data = this.transform(this.service.lastData) || `${this.icon}--- (--%)`;
  }

  transform(data) {
    if (data === null) return;

    const { total, available } = data;

    const used = total - available;
    const usedPercentage = Math.round(100 * used / total);

    const humanized = humanizeBytes(used, 1);

    return `${this.icon}${humanized} (${usedPercentage}%)`;
  }
}

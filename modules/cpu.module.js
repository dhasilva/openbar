// Node
import { on } from 'events';

// Base
import BaseModule from './base.module.js';

// Service
import CPUService from '../services/cpu.service.js';

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

  get icon() {
    // Siji
    return '';
  }

  readLast() {
    this.data = this.transform(this.service.lastData) || `${this.icon}---%`;
  }

  transform(data) {
    if (data === null) return;

    return `${this.icon}${data}%`;
  }
}

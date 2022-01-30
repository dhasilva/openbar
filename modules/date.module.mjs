// Node
import { on } from 'events';

// Base
import BaseModule from './base.module.mjs';

// Service
import DateService from '../services/date.service.mjs';

export default class DateModule extends BaseModule {
  constructor(options = {}) {
    super(options);

    this.service = DateService.getService();
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
    return '';
  }

  readLast() {
    this.data = this.transform(this.service.lastData) || `${this.icon}---`;
  }

  transform(data) {
    if (data === null) return;

    const [firstLetter, ...rest] = data;
    return `${this.icon}${firstLetter.toUpperCase()}${rest.join('')}`;
  }
}

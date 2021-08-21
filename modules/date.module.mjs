const { on } = require('events');

import BaseModule from './base.module.mjs';
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

  readLast() {
    this.data = this.transform(this.service.lastData) || '󰸗 ---';
  }

  transform(data) {
    if (data === null) return;

    const [firstLetter, ...rest] = data;
    return `󰸗 ${firstLetter.toUpperCase()}${rest.join('')}`;
  }
}

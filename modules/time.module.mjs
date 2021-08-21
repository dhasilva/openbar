const { on } = require('events');

import BaseModule from './base.module.mjs';
import TimeService from '../services/time.service.mjs';

export default class TimeModule extends BaseModule {
  constructor(options = {}) {
    super({
      showSeconds: false,

      ...options
    });

    this.actions = {
      left: `!${this.id};toggleShowSeconds`
    };
    
    this.service = TimeService.getService();
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
    this.data = this.transform(this.service.lastData) || '󰅐 --:--';
  }

  transform(data) {
    if (data === null) return;

    let transformed = data;
    
    if (!this.showSeconds) transformed = transformed.split(':').slice(0, -1).join(':');

    return `󰅐 ${transformed}`;
  }

  async toggleShowSeconds() {
    this.showSeconds = !this.showSeconds;
    this.readLast();
  }
}

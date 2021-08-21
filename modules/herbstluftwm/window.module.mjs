const { on } = require('events');

import BaseModule from '../base.module.mjs'
import HerbstluftService from '../../services/herbstluft.service.mjs';

const service = HerbstluftService.getService();

export default class HerbstluftWindowModule extends BaseModule {
  constructor(options = {}) {
    super({
      monitor: '0',
      maxLength: 120,

      ...options
    });
  }

  async initialize() {
    try {
      const tagName = await $s`herbstclient get_attr monitors.${this.monitor}.tag`;
      this.data = this.transform(await $s`herbstclient get_attr tags.by-name.${tagName}.focused_client.title`);
    }
    catch {
      // Empty frame
      this.data = '';
    }

    this.listen();
  }

  async listen() {
    for await (const [title] of on(service.emitter, 'window')) {
      const focusedMonitor = await $s`herbstclient get_attr monitors.focus.index`;

      if (focusedMonitor === this.monitor) this.data = this.transform(title);
    }
  }

  transform(data) {
    if (data.length <= this.maxLength) return data;
    return `${data.slice(0, this.maxLength - 3)}...`;
  }
}

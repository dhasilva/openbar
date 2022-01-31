// Node
import { on } from 'events';

// ZX
import { checkDependency, nothrow, $ } from '../functions.js';

// Base
import BaseModule from './base.module.js';

// Service
import TrayerService from '../services/trayer.service.js';

await checkDependency('trayer');
await nothrow($`killall trayer`);

export default class TrayerModule extends BaseModule {
  constructor(options = {}) {
    super({
      width: 0,

      ...options
    });

    this.service = TrayerService.getService();
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
    this.data = this.transform(this.service.lastData || 0);
  }

  transform(data) {
    return data < 18 ? '' : `| ${''.offset(data)}`;
  }
}

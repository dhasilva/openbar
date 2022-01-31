// Base
import BaseService from './base.service.js';

// ZX
import { $out } from '../functions.js';

export default class CPUService extends BaseService {
  async run() {
    // 100 - idle percentage with 2 seconds interval
    this.lastData = await $out`mpstat 2 1 | awk 'END {print 100-$NF}'`;

    this.emitter.emit('update', this.lastData);
    this.run();
  }
}

import { BaseService } from './base.service.mjs';

export default class CPUService extends BaseService {
  async run() {
    this.lastData = await $s`mpstat 2 1 | awk 'END {print 100-$NF}'`;

    this.emitter.emit('update', this.lastData);
    this.run();
  }
}

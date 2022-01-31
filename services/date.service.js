// Base
import BaseService from './base.service.js';

// ZX
import { $out } from '../functions.js';

export default class DateService extends BaseService {
  async run() {
    this.lastData = await $out`date '+%A, %x'`;

    this.emitter.emit('update', this.lastData);

    // Milliseconds until tomorrow, don't read the date again before that
    const nextCheck = Math.ceil(await $out`echo $(date +%s.%N -d "tomorrow 00:00") - $(date +%s.%N) | bc` * 1000);
    setTimeout(this.run.bind(this), nextCheck);
  }
}

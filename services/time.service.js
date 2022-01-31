// Base
import BaseService from './base.service.js';

// ZX
import { $out } from '../functions.js';

export default class TimeService extends BaseService {
  async run() {
    const time = await $out`date '+%X;%3N'`;
    const [data, milliseconds] = time.split(';');

    this.lastData = data;

    this.emitter.emit('update', this.lastData);

    // Calculates time until next second for correct synchronization
    setTimeout(this.run.bind(this), 1000 - milliseconds);
  }
}

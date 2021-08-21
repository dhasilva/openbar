import { BaseService } from './base.service.mjs';

export default class TimeService extends BaseService {
  async run() {
    const time = await $s`date '+%X;%3N'`;
    const [data, milliseconds] = time.split(';');

    this.lastData = data;

    this.emitter.emit('update', this.lastData);

    setTimeout(this.run.bind(this), 1000 - milliseconds);
  }
}

import { BaseService } from './base.service.mjs';

export default class DateService extends BaseService {
  async run() {
    this.lastData = await $s`date '+%A, %x'`;

    this.emitter.emit('update', this.lastData);

    const nextCheck = Math.ceil(await $s`echo $(date +%s.%N -d "tomorrow 00:00") - $(date +%s.%N) | bc` * 1000);
    setTimeout(this.run.bind(this), nextCheck);
  }
}

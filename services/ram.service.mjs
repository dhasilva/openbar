// Base
import BaseService from './base.service.mjs';

export default class RAMService extends BaseService {
  async run() {
    // $NF is the last value, which in this case is the %idle column
    const ramData = await $s`free -b | grep Mem | awk '{print $2 ":" $NF}'`;
    const [total, available] = ramData.split(':');
    this.lastData = { total, available };

    this.emitter.emit('update', this.lastData);

    setTimeout(this.run.bind(this), 2000);
  }
}

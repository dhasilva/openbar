// Node
import { on } from 'events';

// Base
import BaseService from './base.service.mjs';

export default class TrayerService extends BaseService {
  constructor(options = {}) {
    super({
      autoStart: false,

      ...options
    });
  }

  async run() {
    // Monitors the width of the Trayer panel
    let xprop = $`xprop -name panel -f WM_SIZE_HINTS 32i ' $5\\n' -spy WM_NORMAL_HINTS`.stdout;

    for await (const [chunk] of on(xprop, 'data')) {
      // Sometimes two events can be sent on the same chunk, separated by \n
      const output = chunk.toString().replace(/\n$/, '');
      const events = output.split('\n');
  
      for (const event of events) {
        const width = event.split(' ')[1]

        if (this.lastData !== width) {
          this.lastData = width;
          this.emitter.emit('update', this.lastData);
        }
      }
    }
  }
}

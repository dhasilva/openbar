const { on } = require('events');

import { BaseService } from './base.service.mjs';

export default class HerbstluftService extends BaseService {
  async run() {
    const herbstclient = $`herbstclient -i`.stdout;

    for await (const [chunk] of on(herbstclient, 'data')) {
      // Sometimes two events can be sent on the same chunk, separated by \n
      const output = chunk.toString().replace(/\n$/, '');
      const events = output.split('\n');
  
      for (const event of events) {
        const data = event.split('\t');
        const eventType = data[0];
    
        switch (eventType) {
          case 'tag_changed': // "tag_changed	TAG	MONITOR"
          case 'tag_flags':
            this.emitter.emit('tags');
            await sleep();
            break;
          case 'focus_changed': // "focus_changed	WINID	TITLE"
          case 'window_title_changed': // "window_title_changed	WINID	TITLE"
            this.emitter.emit('window', data[2]);
            await sleep();
            break;
          case 'quit_panel':
            this.emitter.emit('quit');
            await sleep();
            break;
        }
      }
    }
  }
}

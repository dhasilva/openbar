const { on } = require('events');

import { BaseService } from './base.service.mjs';

export default class NetworkService extends BaseService {
  constructor(options = {}) {
    super({
      devices: [],

      ...options
    });

    this.connection = null;

    this.initialize();
  }

  async initialize() {
    try {
      const result = await $s`LANG=en_US.utf8; nmcli | grep -e "connected to" -e "connecting .*to"`;
      // const result = await $`nmcli -t`;

      this.connection = {
        status: result.includes('connected') ? 'connected' : 'connecting',
        ssid: result.split(' to ')[1]
      };
    }
    catch (error) {
      this.connection = { status: 'disconnected' };
    }
  }

  async run() {
    await this.initialize();

    const nmcli = $`LANG=en_US.utf8; nmcli monitor`.stdout;

    for await (const [chunk] of on(nmcli, 'data')) {
      // Sometimes two events can be sent on the same chunk, separated by \n
      const output = chunk.toString().replace(/\n$/, '');
      const events = output.split('\n');
  
      for (const event of events) {
        let connection = { ...this.connection };

        if (event === "Connectivity is now 'none'") connection = { status: 'disconnected', ssid: null };
        if (event.includes('using connection')) connection.ssid = event.split("'")[1];
        if (event.includes('connecting')) connection.status = 'connecting';
        if (event === "Connectivity is now 'limited'") connection.status = 'limited';
        if (event === "Connectivity is now 'full'") connection.status = 'connected';

        if (JSON.stringify(connection) !== JSON.stringify(this.connection)) {
          this.connection = connection;
          this.emitter.emit('update', this.connection);
        }

        await sleep();
      }
    }
  }
}

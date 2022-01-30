// Node
import { on } from 'events';

// Base
import BaseModule from './base.module.mjs';

// Service
import NetworkManagerService from '../services/networkmanager.service.mjs';

export default class NetworkManagerModule extends BaseModule {
  constructor(options = {}) {
    super(options);

    this.service = NetworkManagerService.getService();
  }

  async initialize() {
    this.readLast();

    this.listen();
  }

  async listen() {
    for await (const [data] of on(this.service.emitter, 'update')) {
      this.data = this.transform(data);
    }
  }

  readLast() {
    const lastData = this.transform(this.service.connection);

    if (lastData) this.data = lastData;
    else {
      this.data = '󱉊';

      setTimeout(() => {
        this.readLast();
      }, 100);
    }
  }

  transform(data) {
    if (data === null) return;

    const { status, ssid } = data
    const isWired = !!ssid && ssid.includes('Wired');

    let icon = '';

    if (status === 'disconnected') icon = '󰣽';
    if (status === 'connecting') icon = '󱉊';
    if (status === 'limited') icon = '󰣻';
    if (status === 'connected') icon = isWired ? '󰈀' : '󰣺';

    const name = isWired ? 'Wired' : ssid;
    return `${icon}${name ? ` ${name}` : ''}`;
  }
}

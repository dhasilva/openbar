const { on } = require('events');

import BaseModule from './base.module.mjs';
import AudioService from '../services/audio.service.mjs';

export default class AudioModule extends BaseModule {
  constructor(options = {}) {
    super(options);

    this.actions = {
      left: `!${this.id};toggleMute`,
      right: `pavucontrol`,
      up: `!${this.id};volumeUp`,
      down: `!${this.id};volumeDown`
    }

    this.service = AudioService.getService();
  }

  async initialize() {
    this.readLast();

    this.listen();
  }

  async listen() {
    for await (const [data] of on(this.service.emitter, 'sink')) {
      this.data = this.transform(data);
    }
  }

  readLast() {
    const lastData = this.transform(this.service.sink);
    if (lastData) this.data = lastData;
    else {
      this.data = '󰝞 ---%';
      setTimeout(() => {
        this.readLast();
      }, 100);
    }
  }

  transform(data) {
    if (data === null) return;

    const { muted, volume } = data

    let icon = '󰕾'
    if (muted) icon = '󰖁'
    else if (volume <= 30) icon = '󰕿'
    else if (31 <= volume && volume <= 65) icon = '󰖀'
    else if (101 <= volume) icon = '󰝝'

    return `${icon} ${data.volume}%`
      .foregroundColor('#FF666666', muted);
  }

  async toggleMute() {
    return this.service.toggleMute();
  }

  async volumeUp() {
    return this.service.volumeUp();
  }

  async volumeDown() {
    return this.service.volumeDown()
  }
}

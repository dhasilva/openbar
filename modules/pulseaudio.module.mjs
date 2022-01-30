// Node
import { on } from 'events';

// Base
import BaseModule from './base.module.mjs';

// Service
import PulseAudioService from '../services/pulseaudio.service.mjs';

export default class AudioModule extends BaseModule {
  constructor(options = {}) {
    super(options);

    this.actions = {
      left: `!${this.id};toggleMute`,
      right: `pavucontrol`,
      up: `!${this.id};volumeUp`,
      down: `!${this.id};volumeDown`
    }

    this.service = PulseAudioService.getService();
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

  get icon() {
    // Siji
    return { off: '', low: '', medium: '', high: '', over: '' };
  }

  readLast() {
    const lastData = this.transform(this.service.sink);

    if (lastData) this.data = lastData;
    else {
      this.data = `${this.icon.low}---%`;

      setTimeout(() => {
        this.readLast();
      }, 100);
    }
  }

  transform(data) {
    if (data === null) return;

    const { muted, volume } = data;
    const { off, low, medium, high, over } = this.icon;

    let icon = high;
    if (muted) icon = off;
    else if (volume <= 30) icon = low;
    else if (31 <= volume && volume <= 65) icon = medium;
    else if (101 <= volume) icon = over;

    return `${icon}${data.volume}%`
      .foregroundColor('#FF666666', muted);
  }

  async toggleMute() {
    return this.service.toggleMute();
  }

  async volumeUp() {
    return this.service.volumeUp();
  }

  async volumeDown() {
    return this.service.volumeDown();
  }
}

import BaseBar from './base.bar.mjs';

import TagsModule from '../modules/herbstluftwm/tags.module.mjs';
import WindowModule from '../modules/herbstluftwm/window.module.mjs';
import AudioModule from '../modules/audio.module.mjs';
import CPUModule from '../modules/cpu.module.mjs';
import RAMModule from '../modules/ram.module.mjs';
import DateModule from '../modules/date.module.mjs';
import TimeModule from '../modules/time.module.mjs';
import NetworkModule from '../modules/network.module.mjs';

export default class HerbstluftFullBar extends BaseBar {
  constructor(options = {}) {
    super({
      monitor: 0,
      background: '#CC000000',
      foreground: '#FFCCDDFF',
      lineColor: '#FFCCDDFF',
      lineHeight: 2,
      width: null,
      height: 22,
      // maxActions: 12,

      ...options
    });
  }

  async initializeData() {
    const geometry = await $s`herbstclient monitor_rect ${this.monitor}`;
    const [x, y, width, height] = geometry.split(' ');
    this.x = x;
    this.y = y;
    this.width = width;
  }

  setModules() {
    const tags = new TagsModule({ monitor: this.monitor });
    const window = new WindowModule({ monitor: this.monitor });
    const network = new NetworkModule();
    const audio = new AudioModule();
    const cpu = new CPUModule();
    const ram = new RAMModule();
    const date = new DateModule();
    const time = new TimeModule();

    // this.left = [];
    this.left = [tags];

    // this.center = [];
    this.center = [window];

    // this.right = [time];
    this.right = [network, audio, cpu, ram, date, time];
  }
}

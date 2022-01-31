// Bar
import BaseBar from './base.bar.js';

// ZX
import { $out, $raw } from '../functions.js';

// Modules
import TagsModule from '../modules/herbstluftwm/tags.module.js';
import WindowModule from '../modules/herbstluftwm/window.module.js';
import PulseAudioModule from '../modules/pulseaudio.module.js';
import CPUModule from '../modules/cpu.module.js';
import RAMModule from '../modules/ram.module.js';
import DateModule from '../modules/date.module.js';
import TimeModule from '../modules/time.module.js';
import TrayerModule from '../modules/trayer.module.js';

export default class HerbstluftFullBar extends BaseBar {
  constructor(options = {}) {
    super({
      monitor: 0,
      background: '#FF222222',
      foreground: '#FFCCDDFF',
      lineColor: '#FFCCDDFF',
      lineHeight: 2,
      width: null,
      height: 22,

      hasTray: false,

      ...options
    });
  }

  async initializeData() {
    const geometry = await $out`herbstclient monitor_rect ${this.monitor}`;
    const [x, y, width, height] = geometry.split(' ');
    this.x = x;
    this.y = y;
    this.width = width;
  }

  setModules() {
    const tags = new TagsModule({ monitor: this.monitor });
    const window = new WindowModule({ monitor: this.monitor });
    const audio = new PulseAudioModule();
    const cpu = new CPUModule();
    const ram = new RAMModule();
    const date = new DateModule();
    const time = new TimeModule();
    const tray = new TrayerModule();

    this.left = [tags];

    this.center = [window];

    this.right = [
      audio,
      cpu,
      ram,
      date,
      time
    ];

    if (this.hasTray) {
      this.right.push(tray);

      // Instantiating Trayer after Lemonbar, so it stays on top
      setTimeout(() => {
        // TODO: map monitor to herbstluftwm virtual monitor, they are not the same!
        $raw`trayer --edge top --align right --widthtype request --height 18 --tint 0x292b2e --transparent true --expand true --SetDockType true --alpha 0 --monitor ${this.monitor}`;

        // Waiting for Trayer instance to exist before trying to get its dimensions
        setTimeout(() => {
          tray.service.run();
        }, 300);
      }, 300);
    }
  }
}

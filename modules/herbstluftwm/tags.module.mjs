// Node
import { on } from 'events';

// Base
import BaseModule from '../base.module.mjs';

// Service
import HerbstluftService from '../../services/herbstluft.service.mjs';

export default class HerbstluftTagsModule extends BaseModule {
  constructor(options = {}) {
    super({
      monitor: '0',

      empty: { foreground: '#FF666666' },

      occupied: {},

      urgent: { background: '#FFCC9900' },

      thisMonitor: {
        focused: {
          background: '#FF1177DD',
          underline: true
        },

        unfocused: {
          background: '#FF1177DD',
          underline: false
        }
      },

      anotherMonitor: {
        focused: {
          background: '#FF004C99',
          underline: true
        },

        unfocused: {
          background: '#FF004C99',
          underline: false
        }
      },

      ...options
    });

    this.service = HerbstluftService.getService();
  }

  async initialize() {
    await this.readTags();

    this.listen();
  }

  async readTags() {
    // Sample output: "	:1	.2	.3	.4	.5	.6	-7	:8	#9"
    // ref: https://herbstluftwm.org/herbstluftwm.html
    const status = await $s`herbstclient tag_status ${this.monitor}`;
    let tags = status.split('\t').slice(1, -1);

    this.data = tags.map(tag => this.formatTag(tag)).join('');
  }

  async listen() {
    for await (const event of on(this.service.emitter, 'tags')) {
      await this.readTags();
    }
  }

  tagStyle(state) {
    switch (state) {
      case '.':
        return this.empty;
      case ':':
        return this.occupied;
      case '+':
        return this.thisMonitor.unfocused;
      case '#':
        return this.thisMonitor.focused;
      case '-':
        return this.anotherMonitor.unfocused;
      case '%':
        return this.anotherMonitor.focused;
      case '!':
        return this.urgent;
      default:
        return this;
    }
  }

  formatTag(tag) {
    let [state, ...name] = tag;
    name = name.join('');

    const style = Object.assign({}, {
      lineColor: this.lineColor,
      foreground: this.foreground,
      background: this.background,
      padding: this.padding
    }, this.tagStyle(state));

    return name
      .padding(style.padding)
      .underline(style.underline)
      .overline(style.overline)
      .padding(style.margin)
      // On left click, switch to tag on current monitor
      .action('left', `herbstclient focus_monitor ${this.monitor}; herbstclient use ${name}`)
      .lineColor(style.lineColor)
      .foregroundColor(style.foreground)
      .backgroundColor(style.background);
  }

  format(value) {
    return value
      // On mouse scroll up, switch to next tag on current monitor, skipping visible tags
      .action('up', `herbstclient focus_monitor ${this.monitor}; herbstclient use_index -1 --skip-visible`)
      // On mouse scroll down, switch to previous tag on current monitor, skipping visible tags
      .action('down', `herbstclient focus_monitor ${this.monitor}; herbstclient use_index +1 --skip-visible`)
      .padding(this.margin);
  }
}

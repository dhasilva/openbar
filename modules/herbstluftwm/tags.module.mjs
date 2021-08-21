const { on } = require('events');

import BaseModule from '../base.module.mjs'
import HerbstluftService from '../../services/herbstluft.service.mjs';

const service = HerbstluftService.getService();

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
  }

  async initialize() {
    await this.readTags();

    this.listen();
  }

  async readTags() {
    const status = await $s`herbstclient tag_status ${this.monitor}`;
    let tags = status.split('\t').slice(1, -1);

    this.data = tags.map(tag => this.formatTag(tag)).join('');
  }

  async listen() {
    for await (const event of on(service.emitter, 'tags')) {
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
      .action('left', `herbstclient focus_monitor ${this.monitor}; herbstclient use ${name}`)
      .lineColor(style.lineColor)
      .foregroundColor(style.foreground)
      .backgroundColor(style.background);
  }

  format(value) {
    return value
      .action('up', `herbstclient focus_monitor ${this.monitor}; herbstclient use_index -1 --skip-visible`)
      .action('down', `herbstclient focus_monitor ${this.monitor}; herbstclient use_index +1 --skip-visible`)
      .padding(this.margin);
  }
}

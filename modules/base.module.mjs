let idCounter = 0;

export default class BaseModule {
  constructor(options = {}) {
    Object.assign(this, {
      background: "-",
      foreground: "-",
      underline: false,
      overline: false,
      lineColor: '-',
      padding: 1,
      margin: 0,

      actions: {
        left: null,
        middle: null,
        right: null,
        up: null,
        down: null
      }
    }, options);

    this.id = idCounter++;

    this.text = null;
    this.raw = null;

    this.notify = null
  }

  async install(notify) {
    this.notify = notify;

    if (this.raw === null) await this.initialize();
  }

  async initialize() {
    throw new Error('initialize function must be implemented in the module');
  }

  set data(value) {
    if (value === this.raw) return;

    this.raw = value;
    this.text = this.format(value);

    this.notify(this.constructor.name, this.raw);
  }

  format(value) {
    if (!value) return value

    return value
      .padding(this.padding)
      .underline(this.underline)
      .overline(this.overline)
      .padding(this.margin)
      .action('left', this.actions.left)
      .action('middle', this.actions.middle)
      .action('right', this.actions.right)
      .action('up', this.actions.up)
      .action('down', this.actions.down)
      .lineColor(this.lineColor)
      .foregroundColor(this.foreground)
      .backgroundColor(this.background);
  }

  toString() {
    return this.text;
  }
}

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

    this.rawValue = null;
    this.formattedValue = null;

    this.notify = null
  }

  async install(notify) {
    this.notify = notify;

    if (this.rawValue === null) await this.initialize();
  }

  async initialize() {
    throw new Error('Initialize function must be implemented in the module');
  }

  set data(value) {
    if (value === this.rawValue) return;

    this.rawValue = value;
    this.formattedValue = this.format(value);

    this.notify(this.constructor.name, this.rawValue);
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
    return this.formattedValue;
  }
}

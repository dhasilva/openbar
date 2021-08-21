const { on, EventEmitter } = require('events');

const shell = $`\${SHELL:-bash}`;

export default class BaseBar {
  constructor(options = {}) {
    Object.assign(this, {
      left: [],
      center: [],
      right: [],
      background: '#FF000000',
      foreground: '#FFFFFFFF',
      lineColor: '#FFFFFFFF',
      lineHeight: 1,
      width: 1920,
      height: 22,
      x: 0,
      y: 0,
      maxActions: 1000,
      fonts: [
        {
          name: 'Terminus',
          size: 8,
          offset: -2
        },
        {
          name: 'Material Design Icons Desktop',
          size: 11,
          offset: 0
        },
        {
          name: 'FontAwesome',
          size: 8,
          offset: -3
        },
      ]
    }, options);

    this.emitter = new EventEmitter();

    this.initialize();
  }

  get modules() {
    return [...this.left, ...this.center, ...this.right];
  }

  async initialize() {
    await this.initializeData();

    await this.setModules();

    await this.installModules();

    await this.initializeLemonbar();

    this.initializeUpdateLoop();

    this.initializeActionLoop();
  }

  async initializeData() {}

  async setModules() {}

  async installModules() {
    const notify = this.emitter.emit.bind(this.emitter, 'update');

    for (const module of this.modules) {
      await module.install(notify);
    }
  }

  async initializeLemonbar() {
    const fonts = this.fonts.map(font => `-o ${font.offset} -f "${font.name}:size=${font.size}"`).join(' ');
    this.lemonbar = $.raw`lemonbar -g ${this.width}x${this.height}+${this.x}+${this.y} -u ${this.lineHeight} -B "${this.background}" -F "${this.foreground}" -U "${this.lineColor}" -a ${this.maxActions} ${fonts}  -p`;
    this.lemonbar.stdout.setMaxListeners(10000); /////
  }

  async initializeUpdateLoop() {
    // First render
    await new Promise(resolve => {
      this.lemonbar.stdin.write(this.toString(), null, resolve);
    });

    for await (const [module, value] of on(this.emitter, 'update')) {
      await new Promise(resolve => {
        // console.log(module, value)
        this.lemonbar.stdin.write(this.toString(), null, resolve);
      });
    }
  }

  async initializeActionLoop() {
    for await (const chunk of on(this.lemonbar.stdout, 'data')) {
      const commands = chunk.toString().replace(/\n$/, '').split('\n');

      for await (let command of commands) {
        if (!command.startsWith('!')) {
          await new Promise(resolve => {
            shell.stdin.write(`${command}\n`, null, resolve);
          })
        }
        else {
          // Remove the ! marker and \n at the end
          command = command.replace(/\n$/, '').substr(1);
          // Destructure the associated module and callback
          const [moduleId, callback] = command.split(';');
          // Find the module
          const module = this.modules.find(module => module.id === +moduleId);
          // Execute the callback
          if (!!module) await module[callback]();
        }
      }
    }
  }

  renderPosition(modules, position) {
    const renderedModules = modules.map(module => module.toString()).join('');
    return `%{${position}}${renderedModules}`;
  }

  toString() {
    return [
      this.renderPosition(this.left, 'l'),
      this.renderPosition(this.center, 'c'),
      this.renderPosition(this.right, 'r'),
    ].join('');
  }
}

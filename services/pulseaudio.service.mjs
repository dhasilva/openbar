// Node
import { on } from 'events';

// Base
import BaseService from './base.service.mjs';

export default class PulseAudioService extends BaseService {
  constructor(options = {}) {
    super({
      step: 1,
      maxVolume: 120,
      
      sink: null,
      source: null,

      ...options
    });
  }

  async initialize() {
    await this.updateSink();
    await this.updateSource();
  }

  async updateSink() {
    const name = await $s`LANG=en_US.utf8; pactl info | awk '/Default Sink: / {print $3}'`;
    // -n = quiet, supresses output
    // -E = extended regex
    // s/ = "Substitute" command, with s/regex/replacement/flags syntax. ref https://www.gnu.org/software/sed/manual/html_node/The-_0022s_0022-Command.html
    // ^ = start of string
    // Sink #([0-9]+) = pactl return syntax: "Sink #1"
    // $ = end of string
    // \1 = first captured group, the id in this case
    // p = print
    // This command transforms the output into the id and prints it
    const index = await $sRaw`LANG=en_US.utf8; pactl list sinks | grep -B 4 -E "Name: ${name}" | sed -nE 's/^Sink #([0-9]+)/\\1/p'`;
    const volume = await this.getVolume(index);
    const muted = await this.isMuted(index);

    this.sink = {
      name,
      index,
      volume,
      muted
    }
  }

  // TODO: source implementation
  async updateSource() {}

  async run() {
    await this.initialize();

    // Only 'change' events on sink and source are of interest
    const pactl = $`LANG=en_US.utf8; pactl subscribe | grep --line-buffered "'change'" | grep --line-buffered -e "sink #" -e "source #"`.stdout;

    for await (const [chunk] of on(pactl, 'data')) {
      // Sometimes two events can be sent on the same chunk, separated by \n
      const output = chunk.toString().replace(/\n$/, '');
      const events = output.split('\n');
  
      for (const event of events) {
        if (event.includes('sink')) {
          await this.updateSink();
          this.emitter.emit('sink', this.sink);
        }

        if (event.includes('source')) {
          await this.updateSource();
          this.emitter.emit('source', this.source);
        }

        await sleep();
      }
    }
  }

  async getVolume(index = this.sink.index) {
    return +await $sRaw`LANG=en_US.utf8; pactl list sinks | grep -A 15 -E "^Sink #${index}\$" | grep 'Volume:' | grep -E -v 'Base Volume:' | awk -F : '{print $3; exit}' | grep -o -P '.{0,3}%' | sed 's/.$//' | tr -d ' '`;
  }
  
  async isMuted(index = this.sink.index) {
    const muted = await $sRaw`LANG=en_US.utf8; pactl list sinks | grep -A 15 -E "^Sink #${index}\$" | awk '/Mute: / {print $2}'`;
    return muted === 'yes';
  }
  
  async volumeUp(index = this.sink.index) {
    const curVol = await this.getVolume();
    const volume = `${Math.min(curVol + this.step, this.maxVolume)}%`;
    await $`pactl set-sink-volume ${index} ${volume}`;
  }
  
  async volumeDown(index = this.sink.index) {
    await $`pactl set-sink-volume ${index} -${this.step}%`;
  }
  
  async toggleMute(index = this.sink.index, mute = !this.sink.muted) {
    const shouldMute = mute ? 'yes' : 'no';
    await $`pactl set-sink-mute ${index} ${shouldMute}`;
  }
}

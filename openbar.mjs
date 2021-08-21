#!/usr/bin/env zx

import './zx-setup.mjs';
import './rendering-setup.mjs';

import HerbstluftFullBar from './bars/herbstluft-full.bar.mjs';

process.stdin.setMaxListeners(100);

await nothrow($`killall lemonbar`);

const monitors = (await $s`herbstclient list_monitors | cut -d: -f1`).split('\n');

monitors.forEach(monitor => {
  new HerbstluftFullBar({ monitor });
});

process.on('warning', e => console.warn(e.stack));

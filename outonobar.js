#! /usr/bin/env node

// ZX
import { $out } from './functions.js';

// Setup
import './setup/index.js';

// Bars
import HerbstluftFullBar from './bars/herbstluft-full.bar.js';

const monitors = (await $out`herbstclient list_monitors | cut -d: -f1`).split('\n');

const trayMonitor = '1';

monitors.forEach(monitor => {
  new HerbstluftFullBar({ monitor, hasTray: monitor === trayMonitor });
});

#!/usr/bin/env zx

// Setup
import './setup/index.mjs';

// Bars
import HerbstluftFullBar from './bars/herbstluft-full.bar.mjs';

const monitors = (await $s`herbstclient list_monitors | cut -d: -f1`).split('\n');

const trayMonitor = '1'

monitors.forEach(monitor => {
  new HerbstluftFullBar({ monitor, hasTray: monitor === trayMonitor });
});

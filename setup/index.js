// ZX
import { checkDependency, nothrow, $ } from '../functions.js';

// Setup
import './rendering-properties.js';

await checkDependency('lemonbar');

await nothrow($`killall lemonbar`);

process.on('warning', e => console.warn(e.stack));

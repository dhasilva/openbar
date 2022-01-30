import './functions.mjs';
import './rendering-properties.mjs';

await nothrow($`killall lemonbar`);
await nothrow($`killall trayer`);

process.on('warning', e => console.warn(e.stack));

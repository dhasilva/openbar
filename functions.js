import { $, nothrow, sleep, chalk } from 'zx';
import which from 'which';

// Returns the string response without \n at the end. For simple commands.
export async function $out(pieces, ...args) {
  return (await $(pieces, ...args)).toString().replace(/\n$/, '');
}

// Disables automatic quotes. Use with caution.
export function $raw(pieces, ...args) {
  let str = pieces[0];

  for (let i = 0; i < args.length; i += 1) {
    str += args[i] + pieces[i+1];
  }
  
  return $([str]);
}

export async function $$outRaw(pieces, ...args) {
  return (await $raw(pieces, ...args)).toString().replace(/\n$/, '');
}

export function humanizeBytes(bytes, precision = null) {
  const suffixes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let value = bytes;
  let iteration = 0;

  while (value > 1024) {
    value = value / 1024;
    iteration += 1;
  }

  if (precision !== null) value = value.toFixed(precision);

  return {
    value,
    suffix: suffixes[iteration],

    toString() {
      return `${value}${suffixes[iteration]}`;
    }
  };
}

export async function checkDependency(dependency) {
  return which(dependency)
    .catch(() => {
      console.error(chalk.red(`Package ${dependency} not installed`));
      process.exit(1);
    });
}

export { $, nothrow, sleep };

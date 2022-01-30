// Returns the string response without \n at the end. For simple commands.
export async function $s(pieces, ...args) {
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

export async function $sRaw(pieces, ...args) {
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
  }
}

Object.assign(globalThis, { $s, $sRaw, $raw, humanizeBytes });

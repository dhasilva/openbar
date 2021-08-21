// Disables automatic quotes. Use with caution.
$.raw = (pieces, ...args) => {
  let str = pieces[0];
  for (let i = 0; i < args.length; i += 1) {
    str += args[i] + pieces[i+1];
  }
  
  return $([str]);
}

// Returns the string response without \n at the end. For simple commands.
export async function $s(pieces, ...args) {
  return (await $(pieces, ...args)).toString().replace(/\n$/, '');
}

$s.raw = async (pieces, ...args) => {
  return (await $.raw(pieces, ...args)).toString().replace(/\n$/, '');
}

const suffixes = [
  'B',
  'KiB',
  'MiB',
  'GiB',
  'TiB',
  'PiB',
  'EiB',
  'ZiB',
  'YiB',
]

export function humanizeBytes(bytes, precision = null) {
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

Object.assign(global, { $s, sleep, humanizeBytes });

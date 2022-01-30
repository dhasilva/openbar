Object.defineProperty(String.prototype, 'offset', {
  value(width) {
    return `%{O${width}}${this}%{O-}`;
  }
});

Object.defineProperty(String.prototype, 'backgroundColor', {
  value(color) {
    return `%{B${color}}${this}%{B-}`;
  }
});

Object.defineProperty(String.prototype, 'foregroundColor', {
  value(color, apply = true) {
    if (!apply) return this;

    return `%{F${color}}${this}%{F-}`;
  }
});

Object.defineProperty(String.prototype, 'lineColor', {
  value(color) {
    return `%{U${color}}${this}%{U-}`;
  }
});

Object.defineProperty(String.prototype, 'font', {
  value(fontIndex) {
    return `%{T${fontIndex}}${this}%{T-}`;
  }
});

Object.defineProperty(String.prototype, 'underline', {
  value(apply) {
    if (!apply) return this;

    return `%{+u}${this}%{-u}`;
  }
});

Object.defineProperty(String.prototype, 'overline', {
  value(apply) {
    if (!apply) return this;

    return `%{+o}${this}%{-o}`;
  }
});

Object.defineProperty(String.prototype, 'padding', {
  value(padding) {
    const paddingText = ' '.repeat(padding)
    return `${paddingText}${this}${paddingText}`;
  }
});

Object.defineProperty(String.prototype, 'action', {
  value(button, command) {
    if (!command) return this;

    const codes = {
      left: 1,
      middle: 2,
      right: 3,
      up: 4,
      down: 5
    };

    return `%{A${codes[button]}:${command}:}${this}%{A}`;
  }
});

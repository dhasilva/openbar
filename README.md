# Outonobar

![Screenshot](./assets/screenshot.png)

Outonobar is a simple javascript status bar built on top of [lemonbar](https://github.com/LemonBoy/bar) with [herbstluftwm](https://github.com/herbstluftwm/herbstluftwm) use case in mind.
It uses [zx](https://github.com/google/zx) wrappers to read system information and supports system tray with [trayer-srg](https://github.com/sargon/trayer-srg).
The bars are defined in javascript classes as it is mostly a personal project, so it is not intended to be easy to use (yet?).

`npm install`\
`npm start`

#### Requirements
Node.js >= 16.3\
lemonbar - tested with 1.4 (`lemonbar-xft` on `pacman`)\
trayer-srg - only if using the tray module, tested with 1.1.8 (`trayer` on `pacman`)

---

### Modules

- Herbstluftwm tags and window title
- CPU usage
- Date
- NetworkManager (experimental)
- PulseAudio (default sink only)
- RAM usage
- Time
- Trayer spacer

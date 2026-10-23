// Numbers are for Phaser graphics and tints, strings for CSS-style config.
export const PALETTE = {
  background: 0x14101e,
  backgroundCss: '#14101e',
  text: 0xf4f4f4,
  loadingBarTrack: 0x2a2440,
  loadingBarFill: 0xd2232a, // MIT-WPU red

  // Fill colours for the generated placeholder tileset
  // (scripts/make-placeholder-tiles.mjs). Outlines are a darker shade of each.
  tiles: {
    floor: 0x7a6656,
    wall: 0x5d6478,
    oneWay: 0xb5895a,
    bench: 0x8f5b32,
    blackboard: 0x2e4d3c,
    grill: 0x7f8794,
    spikes: 0xc9ccd4,
  },

  // F1 debug overlay
  debugCollidingTile: 0xff3c78,
  debugTileFace: 0x3cf0ff,
  debugObject: 0xffd23c,
} as const;

// Keyboard bindings as plain data. Names match Phaser's KeyCodes so they
// can be passed straight to `input.keyboard.addKey` (see systems/input.ts).
export const CONTROLS = {
  left: ['A', 'LEFT'],
  right: ['D', 'RIGHT'],
  jump: ['SPACE'],
  record: ['R'],
  throwCard: ['Q'],
  interact: ['E'],
  terminal: ['TAB'],
  copy: ['C'],
  paste: ['V'],
  rewind: ['Z'],
  pointerSwap: ['X'],

  // Free camera until Bit exists; remove once the camera follows him.
  panLeft: ['LEFT'],
  panRight: ['RIGHT'],
  panUp: ['UP'],
  panDown: ['DOWN'],

  // Debug
  debugPhysics: ['F1'],
} as const;

export type ControlAction = keyof typeof CONTROLS;

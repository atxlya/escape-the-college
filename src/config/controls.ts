// Keyboard bindings as plain data. Names match Phaser's KeyCodes so they
// can be passed straight to `input.keyboard.addKeys`. Not wired up yet.
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
} as const;

export type ControlAction = keyof typeof CONTROLS;

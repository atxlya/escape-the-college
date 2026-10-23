// Keyboard bindings as plain data. Names match Phaser's KeyCodes so they
// can be passed straight to `input.keyboard.addKeys`. Not wired up yet.
export const CONTROLS = {
  left: ['LEFT', 'A'],
  right: ['RIGHT', 'D'],
  jump: ['UP', 'W', 'SPACE'],
  record: ['R'],
} as const;

export type ControlAction = keyof typeof CONTROLS;

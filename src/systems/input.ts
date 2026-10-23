import type Phaser from 'phaser';
import { CONTROLS, type ControlAction } from '../config/controls';

/** All keys bound to one action. Capturing stops the browser using them (e.g. F1 help). */
export class ActionKeys {
  private readonly keys: Phaser.Input.Keyboard.Key[];

  constructor(scene: Phaser.Scene, action: ControlAction) {
    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input is disabled');
    this.keys = CONTROLS[action].map((name) => keyboard.addKey(name, true));
  }

  isDown(): boolean {
    return this.keys.some((key) => key.isDown);
  }

  /** Calls `handler` each time any of the keys goes down. */
  onPress(handler: () => void): void {
    for (const key of this.keys) key.on('down', handler);
  }
}

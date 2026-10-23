import Phaser from 'phaser';
import { registerPixelFont } from '../systems/pixelFont';

// First scene: one-time setup that must happen before anything loads.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    registerPixelFont(this);
    this.scene.start('Preload');
  }
}

import Phaser from 'phaser';

// First scene: one-time setup that must happen before anything loads.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    this.scene.start('Preload');
  }
}

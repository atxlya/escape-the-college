import Phaser from 'phaser';
import { COLOURS } from '../content/colours';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/tuning';

// Loads all game assets and shows a progress bar. Nothing to load yet.
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload(): void {
    const barWidth = 160;
    const barHeight = 6;
    const x = Math.round((GAME_WIDTH - barWidth) / 2);
    const y = Math.round((GAME_HEIGHT - barHeight) / 2);

    this.add.rectangle(x, y, barWidth, barHeight, COLOURS.loadingBarTrack).setOrigin(0);
    const fill = this.add.rectangle(x, y, 0, barHeight, COLOURS.loadingBarFill).setOrigin(0);

    this.load.on('progress', (value: number) => {
      fill.width = Math.round(barWidth * value);
    });

    // Asset loading goes here, e.g. this.load.tilemapTiledJSON('l1-1', 'maps/l1-1.json');
  }

  create(): void {
    this.scene.start('Game');
  }
}

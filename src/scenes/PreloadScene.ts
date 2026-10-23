import Phaser from 'phaser';
import { PALETTE } from '../content/palette';
import { START_LEVEL } from '../config/levels';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/tuning';
import { LevelLoader } from '../systems/LevelLoader';

// Loads all game assets and shows a progress bar.
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload(): void {
    const barWidth = 160;
    const barHeight = 6;
    const x = Math.round((GAME_WIDTH - barWidth) / 2);
    const y = Math.round((GAME_HEIGHT - barHeight) / 2);

    this.add.rectangle(x, y, barWidth, barHeight, PALETTE.loadingBarTrack).setOrigin(0);
    const fill = this.add.rectangle(x, y, 0, barHeight, PALETTE.loadingBarFill).setOrigin(0);

    this.load.on('progress', (value: number) => {
      fill.width = Math.round(barWidth * value);
    });

    new LevelLoader(this).preload(START_LEVEL);
  }

  create(): void {
    this.scene.start('Game');
  }
}

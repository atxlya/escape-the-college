import Phaser from 'phaser';
import { COLOURS } from '../content/colours';
import { BUILD_LABEL } from '../content/strings';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/tuning';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create(): void {
    this.add
      .text(Math.round(GAME_WIDTH / 2), Math.round(GAME_HEIGHT / 2), BUILD_LABEL, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: COLOURS.text,
      })
      .setOrigin(0.5)
      .setResolution(1);
  }
}

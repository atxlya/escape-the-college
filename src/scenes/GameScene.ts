import Phaser from 'phaser';
import { COLOURS } from '../content/colours';
import { BUILD_LABEL } from '../content/strings';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/tuning';
import { addPixelText, centredX } from '../systems/pixelFont';
import { CELL_HEIGHT } from '../logic/pixelFont';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create(): void {
    const y = Math.floor((GAME_HEIGHT - CELL_HEIGHT) / 2);
    addPixelText(this, centredX(BUILD_LABEL, GAME_WIDTH), y, BUILD_LABEL, COLOURS.text);
  }
}

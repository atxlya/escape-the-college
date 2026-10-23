import Phaser from 'phaser';
import { PALETTE } from '../content/palette';
import { BootScene } from '../scenes/BootScene';
import { GameScene } from '../scenes/GameScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { GAME_HEIGHT, GAME_WIDTH, PHYSICS_FPS } from './tuning';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: PALETTE.backgroundCss,
  pixelArt: true,
  roundPixels: true,
  scale: {
    // We pick a whole-number zoom ourselves (see main.ts) instead of FIT,
    // which would stretch by fractional amounts and blur pixels.
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  fps: { target: PHYSICS_FPS },
  physics: {
    default: 'arcade',
    arcade: {
      fps: PHYSICS_FPS,
      fixedStep: true,
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, PreloadScene, GameScene],
};

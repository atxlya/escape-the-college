import Phaser from 'phaser';
import './styles.css';
import { gameConfig } from './config/game';
import { GAME_HEIGHT, GAME_WIDTH } from './config/tuning';
import { integerZoom } from './logic/scaling';

const game = new Phaser.Game(gameConfig);

// Scale by whole numbers only so every game pixel stays an exact square.
function applyZoom(): void {
  game.scale.setZoom(integerZoom(window.innerWidth, window.innerHeight, GAME_WIDTH, GAME_HEIGHT));
}

applyZoom();
window.addEventListener('resize', applyZoom);

import Phaser from 'phaser';
import { PALETTE } from '../content/palette';
import { BUILD_LABEL } from '../content/strings';
import { START_LEVEL } from '../config/levels';
import { CAMERA_PAN_SPEED } from '../config/tuning';
import { ActionKeys } from '../systems/input';
import { findObject, LevelLoader, type Level } from '../systems/LevelLoader';
import { PhysicsDebug } from '../systems/physicsDebug';
import { addPixelText } from '../systems/pixelFont';

const LABEL_MARGIN = 4;

export class GameScene extends Phaser.Scene {
  private level!: Level;
  private pan!: Record<'left' | 'right' | 'up' | 'down', ActionKeys>;
  // Camera position kept as a float so slow panning doesn't stall; drawn rounded.
  private camX = 0;
  private camY = 0;

  constructor() {
    super('Game');
  }

  create(): void {
    this.level = new LevelLoader(this).build(START_LEVEL);
    new PhysicsDebug(this, this.level);

    const cam = this.cameras.main;
    const spawn = findObject(this.level, 'PlayerSpawn');
    this.camX = (spawn?.x ?? 0) - cam.width / 2;
    this.camY = (spawn?.y ?? 0) - cam.height / 2;
    this.moveCamera(0, 0);

    this.pan = {
      left: new ActionKeys(this, 'panLeft'),
      right: new ActionKeys(this, 'panRight'),
      up: new ActionKeys(this, 'panUp'),
      down: new ActionKeys(this, 'panDown'),
    };

    addPixelText(this, LABEL_MARGIN, LABEL_MARGIN, BUILD_LABEL, PALETTE.text).setScrollFactor(0);
  }

  update(_time: number, delta: number): void {
    const step = (CAMERA_PAN_SPEED * delta) / 1000;
    const dx = Number(this.pan.right.isDown()) - Number(this.pan.left.isDown());
    const dy = Number(this.pan.down.isDown()) - Number(this.pan.up.isDown());
    this.moveCamera(dx * step, dy * step);
  }

  /** Moves the free camera, keeping it inside the map and on whole pixels. */
  private moveCamera(dx: number, dy: number): void {
    const cam = this.cameras.main;
    this.camX = Phaser.Math.Clamp(this.camX + dx, 0, Math.max(0, this.level.width - cam.width));
    this.camY = Phaser.Math.Clamp(this.camY + dy, 0, Math.max(0, this.level.height - cam.height));
    cam.setScroll(Math.round(this.camX), Math.round(this.camY));
  }
}

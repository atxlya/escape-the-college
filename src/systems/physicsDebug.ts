import Phaser from 'phaser';
import { PALETTE } from '../content/palette';
import { ActionKeys } from './input';
import type { Level } from './LevelLoader';

const COLLIDING_TILE_ALPHA = 90;
const MARKER_SIZE = 3;

/**
 * F1 overlay: Arcade body outlines, colliding tiles with their solid faces
 * (one-way tiles show only a top edge), and the Tiled objects' positions.
 */
export class PhysicsDebug {
  private on = false;
  private readonly graphics: Phaser.GameObjects.Graphics;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly level: Level,
  ) {
    this.graphics = scene.add.graphics().setDepth(Number.MAX_SAFE_INTEGER);
    new ActionKeys(scene, 'debugPhysics').onPress(() => this.toggle());
  }

  toggle(): void {
    this.on = !this.on;
    const world = this.scene.physics.world;
    if (this.on && !world.debugGraphic) world.createDebugGraphic();
    world.drawDebug = this.on;
    world.debugGraphic?.clear();

    this.graphics.clear();
    if (this.on) this.drawLevel();
  }

  private drawLevel(): void {
    const colliding = Phaser.Display.Color.IntegerToColor(PALETTE.debugCollidingTile);
    colliding.alpha = COLLIDING_TILE_ALPHA;
    this.level.ground.renderDebug(this.graphics, {
      tileColor: null,
      collidingTileColor: colliding,
      faceColor: Phaser.Display.Color.IntegerToColor(PALETTE.debugTileFace),
    });

    this.graphics.lineStyle(1, PALETTE.debugObject);
    for (const obj of this.level.objects) {
      if (obj.point || obj.width === 0 || obj.height === 0) {
        const x = Math.round(obj.x);
        const y = Math.round(obj.y);
        this.graphics.lineBetween(x - MARKER_SIZE, y, x + MARKER_SIZE, y);
        this.graphics.lineBetween(x, y - MARKER_SIZE, x, y + MARKER_SIZE);
      } else {
        this.graphics.strokeRect(obj.x, obj.y, obj.width, obj.height);
      }
    }
  }
}

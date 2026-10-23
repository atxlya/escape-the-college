import type Phaser from 'phaser';
import { Registry } from '../logic/registry';
import type { LevelObject } from '../logic/tiled';

/** What an object factory gets besides its own Tiled object. */
export interface LevelContext {
  scene: Phaser.Scene;
  tilemap: Phaser.Tilemaps.Tilemap;
  ground: Phaser.Tilemaps.TilemapLayer;
}

/** Builds the game object for one Tiled object, or nothing for pure markers. */
export type ObjectFactory = (
  obj: LevelObject,
  ctx: LevelContext,
) => Phaser.GameObjects.GameObject | void;

/**
 * Every object type a map may use, keyed by the object's Type in Tiled.
 * Add a type by registering a factory here and a row in docs/LEVELS.md.
 */
export const levelObjects = new Registry<ObjectFactory>('Object type').register(
  // Marker only: scenes read its position (Bit is created here from 1.1).
  'PlayerSpawn',
  () => undefined,
);

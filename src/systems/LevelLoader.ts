import Phaser from 'phaser';
import {
  embedTilesets,
  externalTilesetUrls,
  parseTiledMap,
  parseTiledTileset,
  readObjectLayer,
  resolvePath,
  type LevelObject,
  type TiledMap,
} from '../logic/tiled';
import { levelObjects, type LevelContext, type ObjectFactory } from './levelObjects';
import type { Registry } from '../logic/registry';

/** Layer names the loader looks for. Other tile layers are drawn but never collide. */
export const LAYER_NAMES = {
  ground: 'Ground',
  objects: 'Objects',
} as const;

export interface Level {
  key: string;
  tilemap: Phaser.Tilemaps.Tilemap;
  /** Every tile layer by name, drawn in map order (Background, Ground, Decor...). */
  layers: ReadonlyMap<string, Phaser.Tilemaps.TilemapLayer>;
  ground: Phaser.Tilemaps.TilemapLayer;
  objects: readonly LevelObject[];
  /** Game objects the factories created, in map order. */
  instances: readonly Phaser.GameObjects.GameObject[];
  width: number;
  height: number;
}

const mapUrl = (key: string): string => `maps/${key}.tmj`;
const mapCacheKey = (key: string): string => `map:${key}`;
const tilesetCacheKey = (url: string): string => `tileset:${url}`;

/**
 * Loads Tiled maps by key (public/maps/<key>.tmj) and turns them into tile
 * layers, collision and game objects. Call `preload` in a scene's preload()
 * and `build` in create().
 */
export class LevelLoader {
  constructor(
    private readonly scene: Phaser.Scene,
    private readonly registry: Registry<ObjectFactory> = levelObjects,
  ) {}

  /** Queues the map, then its tilesets and their images once the map arrives. */
  preload(key: string): void {
    const url = mapUrl(key);
    const cached: unknown = this.scene.cache.json.get(mapCacheKey(key));
    if (cached) {
      this.queueTilesets(parseTiledMap(cached, url), url);
      return;
    }
    this.scene.load.once(
      `filecomplete-json-${mapCacheKey(key)}`,
      (_key: string, _type: string, data: unknown) => {
        this.queueTilesets(parseTiledMap(data, url), url);
      },
    );
    this.scene.load.json(mapCacheKey(key), url);
  }

  build(key: string): Level {
    const url = mapUrl(key);
    const raw: unknown = this.scene.cache.json.get(mapCacheKey(key));
    if (!raw) throw new Error(`Level "${key}" was not preloaded`);
    const map = embedTilesets(parseTiledMap(raw, url), url, (tilesetUrl) =>
      parseTiledTileset(this.scene.cache.json.get(tilesetCacheKey(tilesetUrl)), tilesetUrl),
    );

    const tilemap = this.makeTilemap(key, map);
    const tilesets = map.tilesets.map((ts) => {
      // Tileset images are loaded under their URL, so the URL is the texture key.
      const tileset = tilemap.addTilesetImage(ts.name ?? '', ts.image);
      if (!tileset) throw new Error(`${url}: could not add tileset "${ts.name ?? '?'}"`);
      return tileset;
    });

    const layers = new Map<string, Phaser.Tilemaps.TilemapLayer>();
    for (const name of tilemap.getTileLayerNames()) {
      const layer = tilemap.createLayer(name, tilesets);
      if (!layer) throw new Error(`${url}: could not create layer "${name}"`);
      layers.set(name, layer);
    }

    const ground = layers.get(LAYER_NAMES.ground);
    if (!ground) throw new Error(`${url}: needs a tile layer named "${LAYER_NAMES.ground}"`);
    setUpCollision(ground);

    const width = tilemap.widthInPixels;
    const height = tilemap.heightInPixels;
    this.scene.physics.world.setBounds(0, 0, width, height);

    const objects = readObjectLayer(map, LAYER_NAMES.objects);
    const instances = this.createObjects(objects, { scene: this.scene, tilemap, ground }, url);

    return { key, tilemap, layers, ground, objects, instances, width, height };
  }

  private queueTilesets(map: TiledMap, url: string): void {
    for (const ts of map.tilesets) {
      if (!ts.source && ts.image) this.queueImage(resolvePath(url, ts.image));
    }
    for (const tilesetUrl of externalTilesetUrls(map, url)) {
      const cacheKey = tilesetCacheKey(tilesetUrl);
      const onTileset = (data: unknown): void => {
        const tileset = parseTiledTileset(data, tilesetUrl);
        this.queueImage(resolvePath(tilesetUrl, tileset.image));
      };
      const cached: unknown = this.scene.cache.json.get(cacheKey);
      if (cached) {
        onTileset(cached);
      } else {
        this.scene.load.once(
          `filecomplete-json-${cacheKey}`,
          (_key: string, _type: string, data: unknown) => onTileset(data),
        );
        this.scene.load.json(cacheKey, tilesetUrl);
      }
    }
  }

  private queueImage(url: string): void {
    if (!this.scene.textures.exists(url)) this.scene.load.image(url, url);
  }

  private makeTilemap(key: string, map: TiledMap): Phaser.Tilemaps.Tilemap {
    if (!this.scene.cache.tilemap.exists(key)) {
      this.scene.cache.tilemap.add(key, { format: Phaser.Tilemaps.Formats.TILED_JSON, data: map });
    }
    return this.scene.make.tilemap({ key });
  }

  private createObjects(
    objects: readonly LevelObject[],
    ctx: LevelContext,
    url: string,
  ): Phaser.GameObjects.GameObject[] {
    const instances: Phaser.GameObjects.GameObject[] = [];
    for (const obj of objects) {
      const factory = this.registry.get(obj.type);
      if (!factory) {
        // Skip rather than crash so a half-built map still opens.
        console.warn(`${url}: unknown object type "${obj.type}" (object ${obj.id}), skipped`);
        continue;
      }
      const instance = factory(obj, ctx);
      if (instance) instances.push(instance);
    }
    return instances;
  }
}

/** First object of a type, e.g. the PlayerSpawn. */
export function findObject(level: Level, type: string): LevelObject | undefined {
  return level.objects.find((obj) => obj.type === type);
}

/**
 * Tiles with `collides` block on every side. Tiles that also have `oneWay`
 * only block from above, so bodies can jump up through them.
 */
function setUpCollision(ground: Phaser.Tilemaps.TilemapLayer): void {
  ground.setCollisionByProperty({ collides: true });
  ground.forEachTile((tile) => {
    if (tile.properties?.oneWay !== true) return;
    tile.setCollision(false, false, true, false, false);
    // Phaser's face pass marks all four sides; clear them so debug drawing matches.
    tile.faceLeft = false;
    tile.faceRight = false;
    tile.faceBottom = false;
  });
}

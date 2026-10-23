// Reading Tiled JSON maps (.tmj) and tilesets (.tsj) without Phaser.
// Only the fields the game uses are typed; everything else passes through.

export type PropertyValue = string | number | boolean;
export type Properties = Readonly<Record<string, PropertyValue>>;

interface TiledProperty {
  name: string;
  type?: string;
  value: unknown;
}

export interface TiledObject {
  id: number;
  name?: string;
  type?: string;
  class?: string; // older Tiled builds wrote `class` instead of `type`
  x: number;
  y: number;
  width?: number;
  height?: number;
  point?: boolean;
  properties?: TiledProperty[];
}

export interface TiledLayer {
  name: string;
  type: string; // 'tilelayer' | 'objectgroup' | 'imagelayer' | 'group'
  objects?: TiledObject[];
  [key: string]: unknown;
}

export interface TiledTilesetRef {
  firstgid: number;
  source?: string; // set when the tileset lives in its own .tsj file
  name?: string;
  image?: string;
  [key: string]: unknown;
}

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  infinite?: boolean;
  layers: TiledLayer[];
  tilesets: TiledTilesetRef[];
  [key: string]: unknown;
}

export interface TiledTileset {
  name: string;
  image: string;
  [key: string]: unknown;
}

/** An object from a map's object layer, flattened for factories to read. */
export interface LevelObject {
  id: number;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  point: boolean;
  properties: Properties;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Checks the parts of a .tmj the loader relies on and gives a readable error otherwise. */
export function parseTiledMap(data: unknown, source: string): TiledMap {
  if (!isRecord(data)) throw new Error(`${source}: not a Tiled JSON map`);
  for (const field of ['width', 'height', 'tilewidth', 'tileheight']) {
    if (typeof data[field] !== 'number') throw new Error(`${source}: missing "${field}"`);
  }
  if (!Array.isArray(data.layers) || !Array.isArray(data.tilesets)) {
    throw new Error(`${source}: missing "layers" or "tilesets"`);
  }
  if (data.infinite === true) {
    throw new Error(`${source}: infinite maps are not supported (Map > Map Properties > Infinite)`);
  }
  return data as TiledMap;
}

export function parseTiledTileset(data: unknown, source: string): TiledTileset {
  if (!isRecord(data) || typeof data.name !== 'string' || typeof data.image !== 'string') {
    throw new Error(`${source}: not a single-image Tiled tileset`);
  }
  return data as TiledTileset;
}

/**
 * Resolves `relative` against the folder of the file at `from`, the way Tiled
 * stores paths. Both are URL paths like 'maps/test-room.tmj'.
 */
export function resolvePath(from: string, relative: string): string {
  const parts = from.split('/').slice(0, -1);
  for (const part of relative.split('/')) {
    if (part === '..') {
      if (parts.length === 0 || parts[parts.length - 1] === '..') parts.push('..');
      else parts.pop();
    } else if (part !== '.' && part !== '') {
      parts.push(part);
    }
  }
  return parts.join('/');
}

/** URLs of the external tileset files a map points to. */
export function externalTilesetUrls(map: TiledMap, mapUrl: string): string[] {
  return map.tilesets.flatMap((ts) => (ts.source ? [resolvePath(mapUrl, ts.source)] : []));
}

/**
 * Returns a copy of the map with every external tileset copied in, and every
 * tileset image path made relative to the page instead of to its file.
 * Phaser can only read embedded tilesets, but we keep shared .tsj files in Tiled.
 */
export function embedTilesets(
  map: TiledMap,
  mapUrl: string,
  getTileset: (url: string) => TiledTileset,
): TiledMap {
  const tilesets = map.tilesets.map((ref): TiledTilesetRef => {
    if (!ref.source) {
      if (!ref.image) throw new Error(`${mapUrl}: tileset "${ref.name ?? '?'}" has no image`);
      return { ...ref, image: resolvePath(mapUrl, ref.image) };
    }
    const url = resolvePath(mapUrl, ref.source);
    const tileset = getTileset(url);
    return { ...tileset, firstgid: ref.firstgid, image: resolvePath(url, tileset.image) };
  });
  return { ...map, tilesets };
}

/** Turns Tiled's property list into a plain lookup. Class and object properties are skipped. */
export function readProperties(list: readonly TiledProperty[] | undefined): Properties {
  const out: Record<string, PropertyValue> = {};
  for (const { name, value } of list ?? []) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      out[name] = value;
    }
  }
  return out;
}

/** All objects in the named object layer, or an empty list if the map has no such layer. */
export function readObjectLayer(map: TiledMap, layerName: string): LevelObject[] {
  const layer = map.layers.find((l) => l.name === layerName && l.type === 'objectgroup');
  return (layer?.objects ?? []).map((obj) => ({
    id: obj.id,
    name: obj.name ?? '',
    type: obj.type || obj.class || '',
    x: obj.x,
    y: obj.y,
    width: obj.width ?? 0,
    height: obj.height ?? 0,
    point: obj.point === true,
    properties: readProperties(obj.properties),
  }));
}

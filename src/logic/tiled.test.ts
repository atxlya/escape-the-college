import { describe, expect, it } from 'vitest';
import {
  embedTilesets,
  externalTilesetUrls,
  parseTiledMap,
  parseTiledTileset,
  readObjectLayer,
  readProperties,
  resolvePath,
  type TiledMap,
} from './tiled';

function makeMap(overrides: Partial<TiledMap> = {}): TiledMap {
  return {
    width: 2,
    height: 2,
    tilewidth: 16,
    tileheight: 16,
    layers: [],
    tilesets: [],
    ...overrides,
  };
}

describe('resolvePath', () => {
  it('resolves relative to the folder of the file', () => {
    expect(resolvePath('maps/test-room.tmj', '../tilesets/placeholder.tsj')).toBe(
      'tilesets/placeholder.tsj',
    );
    expect(resolvePath('tilesets/placeholder.tsj', 'placeholder.png')).toBe(
      'tilesets/placeholder.png',
    );
    expect(resolvePath('maps/world1/a.tmj', './b/../c.tsj')).toBe('maps/world1/c.tsj');
  });

  it('keeps leading .. when it climbs above the start', () => {
    expect(resolvePath('a.tmj', '../x.png')).toBe('../x.png');
  });
});

describe('parseTiledMap', () => {
  it('accepts a minimal map', () => {
    expect(parseTiledMap(makeMap(), 'm').width).toBe(2);
  });

  it('rejects non-maps and infinite maps with the file name in the message', () => {
    expect(() => parseTiledMap('nope', 'maps/x.tmj')).toThrow('maps/x.tmj');
    expect(() => parseTiledMap({ ...makeMap(), width: undefined }, 'm')).toThrow('"width"');
    expect(() => parseTiledMap(makeMap({ infinite: true }), 'm')).toThrow('infinite');
  });
});

describe('parseTiledTileset', () => {
  it('needs a name and a single image', () => {
    expect(parseTiledTileset({ name: 't', image: 't.png' }, 's').name).toBe('t');
    expect(() => parseTiledTileset({ name: 't' }, 'tilesets/t.tsj')).toThrow('tilesets/t.tsj');
  });
});

describe('embedTilesets', () => {
  const map = makeMap({
    tilesets: [
      { firstgid: 1, source: '../tilesets/placeholder.tsj' },
      { firstgid: 10, name: 'inline', image: '../tilesets/inline.png' },
    ],
  });

  it('lists only external tileset files', () => {
    expect(externalTilesetUrls(map, 'maps/room.tmj')).toEqual(['tilesets/placeholder.tsj']);
  });

  it('copies external tilesets in and makes image paths page-relative', () => {
    const embedded = embedTilesets(map, 'maps/room.tmj', (url) => {
      expect(url).toBe('tilesets/placeholder.tsj');
      return { name: 'placeholder', image: 'placeholder.png', tilewidth: 16 };
    });
    expect(embedded.tilesets).toEqual([
      { name: 'placeholder', image: 'tilesets/placeholder.png', tilewidth: 16, firstgid: 1 },
      { firstgid: 10, name: 'inline', image: 'tilesets/inline.png' },
    ]);
    // The original map is left untouched.
    expect(map.tilesets[0]?.source).toBe('../tilesets/placeholder.tsj');
  });
});

describe('readProperties', () => {
  it('flattens Tiled property lists and skips class values', () => {
    expect(
      readProperties([
        { name: 'collides', type: 'bool', value: true },
        { name: 'speed', type: 'int', value: 3 },
        { name: 'label', type: 'string', value: 'hi' },
        { name: 'nested', type: 'class', value: { a: 1 } },
      ]),
    ).toEqual({ collides: true, speed: 3, label: 'hi' });
    expect(readProperties(undefined)).toEqual({});
  });
});

describe('readObjectLayer', () => {
  const map = makeMap({
    layers: [
      { name: 'Ground', type: 'tilelayer' },
      {
        name: 'Objects',
        type: 'objectgroup',
        objects: [
          { id: 1, name: 'spawn', type: 'PlayerSpawn', x: 48, y: 64, point: true },
          {
            id: 2,
            class: 'Door',
            x: 0,
            y: 0,
            width: 16,
            height: 32,
            properties: [{ name: 'open', type: 'bool', value: false }],
          },
        ],
      },
    ],
  });

  it('reads type (or legacy class), size and properties', () => {
    expect(readObjectLayer(map, 'Objects')).toEqual([
      {
        id: 1,
        name: 'spawn',
        type: 'PlayerSpawn',
        x: 48,
        y: 64,
        width: 0,
        height: 0,
        point: true,
        properties: {},
      },
      {
        id: 2,
        name: '',
        type: 'Door',
        x: 0,
        y: 0,
        width: 16,
        height: 32,
        point: false,
        properties: { open: false },
      },
    ]);
  });

  it('returns an empty list when the layer is missing or not an object layer', () => {
    expect(readObjectLayer(map, 'Nope')).toEqual([]);
    expect(readObjectLayer(map, 'Ground')).toEqual([]);
  });
});

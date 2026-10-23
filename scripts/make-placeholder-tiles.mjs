// Generates the placeholder tileset: public/tilesets/placeholder.png and the
// Tiled tileset file placeholder.tsj next to it. Both come from TILES below,
// so edit this script (not the .tsj in Tiled) and re-run:
//   npm run tiles
// Colours come from src/content/palette.ts (Node strips its types on import).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import { PALETTE } from '../src/content/palette.ts';

const TILE = 16;
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'tilesets');
const NAME = 'placeholder';

// Order = tile id in Tiled. Append new tiles at the end so existing maps keep working.
// `shape` picks which pixels are filled; everything else is transparent.
const TILES = [
  { type: 'floor', colour: PALETTE.tiles.floor, shape: 'full', collides: true },
  { type: 'wall', colour: PALETTE.tiles.wall, shape: 'full', collides: true },
  { type: 'oneWay', colour: PALETTE.tiles.oneWay, shape: 'slab', collides: true, oneWay: true },
  { type: 'bench', colour: PALETTE.tiles.bench, shape: 'bench', collides: true, oneWay: true },
  { type: 'blackboard', colour: PALETTE.tiles.blackboard, shape: 'full' },
  { type: 'grill', colour: PALETTE.tiles.grill, shape: 'grill', collides: true },
  { type: 'spikes', colour: PALETTE.tiles.spikes, shape: 'spikes', hazard: true },
];

const SHAPES = {
  full: () => true,
  // Thin platform along the top, so it reads as "jump up through me".
  slab: (_x, y) => y < 5,
  // Seat along the top plus two legs.
  bench: (x, y) => y < 5 || ((x < 3 || x > 12) && y < TILE),
  // Frame with vertical bars.
  grill: (x, y) => x < 1 || x > 14 || y < 1 || y > 14 || x % 4 === 1,
  // Three triangles pointing up from the bottom.
  spikes: (x, y) => {
    const local = x % 5;
    const half = Math.min(local, 4 - local); // 0 at the edges, 2 in the middle
    return x < 15 && y >= 6 && y >= TILE - 4 - half * 4;
  },
};

function darker(colour) {
  const scale = (c) => Math.floor(c * 0.6);
  return [scale((colour >> 16) & 0xff), scale((colour >> 8) & 0xff), scale(colour & 0xff)];
}

function rgb(colour) {
  return [(colour >> 16) & 0xff, (colour >> 8) & 0xff, colour & 0xff];
}

// A filled pixel is outline if any of its 4 neighbours is empty or off the tile.
function drawTile(pixels, width, tileIndex, tile) {
  const inside = SHAPES[tile.shape];
  const filled = (x, y) => x >= 0 && y >= 0 && x < TILE && y < TILE && inside(x, y);
  const fill = rgb(tile.colour);
  const edge = darker(tile.colour);
  for (let y = 0; y < TILE; y++) {
    for (let x = 0; x < TILE; x++) {
      if (!filled(x, y)) continue;
      const isEdge =
        !filled(x - 1, y) || !filled(x + 1, y) || !filled(x, y - 1) || !filled(x, y + 1);
      const [r, g, b] = isEdge ? edge : fill;
      const i = (y * width + tileIndex * TILE + x) * 4;
      pixels.set([r, g, b, 255], i);
    }
  }
}

// --- Minimal PNG writer (8-bit RGBA, no filtering) ---

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const out = Buffer.alloc(typeAndData.length + 8);
  out.writeUInt32BE(data.length, 0);
  typeAndData.copy(out, 4);
  out.writeUInt32BE(crc32(typeAndData), out.length - 4);
  return out;
}

function encodePng(width, height, pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // RGBA
  const rowBytes = width * 4;
  const raw = Buffer.alloc((rowBytes + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (rowBytes + 1)] = 0; // filter: none
    Buffer.from(pixels.buffer, y * rowBytes, rowBytes).copy(raw, y * (rowBytes + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Tiled tileset (.tsj) ---

function tilesetJson(width) {
  return {
    type: 'tileset',
    version: '1.10',
    tiledversion: '1.11.2',
    name: NAME,
    image: `${NAME}.png`,
    imagewidth: width,
    imageheight: TILE,
    tilewidth: TILE,
    tileheight: TILE,
    tilecount: TILES.length,
    columns: TILES.length,
    margin: 0,
    spacing: 0,
    tiles: TILES.map((tile, id) => ({
      id,
      type: tile.type,
      properties: [
        { name: 'collides', type: 'bool', value: Boolean(tile.collides) },
        { name: 'hazard', type: 'bool', value: Boolean(tile.hazard) },
        { name: 'oneWay', type: 'bool', value: Boolean(tile.oneWay) },
      ],
    })),
  };
}

const width = TILE * TILES.length;
const pixels = new Uint8Array(width * TILE * 4);
TILES.forEach((tile, i) => drawTile(pixels, width, i, tile));

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, `${NAME}.png`), encodePng(width, TILE, pixels));
writeFileSync(join(OUT_DIR, `${NAME}.tsj`), `${JSON.stringify(tilesetJson(width), null, 2)}\n`);
console.log(`Wrote ${NAME}.png and ${NAME}.tsj (${TILES.length} tiles) to public/tilesets/`);

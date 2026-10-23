// Pure helpers for the built-in pixel font. The Phaser side lives in
// src/systems/pixelFont.ts and only paints what these functions describe.

export const GLYPH_WIDTH = 5;
export const GLYPH_HEIGHT = 9;
/** Each glyph sits in a cell with one blank column and row as spacing. */
export const CELL_WIDTH = GLYPH_WIDTH + 1;
export const CELL_HEIGHT = GLYPH_HEIGHT + 1;

export type GlyphMap = Readonly<Record<string, readonly string[]>>;

/** Turns '#'/'.' rows into a full GLYPH_HEIGHT x GLYPH_WIDTH on/off grid. */
export function parseGlyph(rows: readonly string[]): boolean[][] {
  if (rows.length > GLYPH_HEIGHT) {
    throw new Error(`Glyph has ${rows.length} rows, max is ${GLYPH_HEIGHT}`);
  }
  const grid: boolean[][] = [];
  for (let y = 0; y < GLYPH_HEIGHT; y++) {
    const row = rows[y] ?? '.'.repeat(GLYPH_WIDTH);
    if (row.length !== GLYPH_WIDTH || /[^#.]/.test(row)) {
      throw new Error(`Bad glyph row "${row}": need ${GLYPH_WIDTH} chars of # or .`);
    }
    grid.push([...row].map((c) => c === '#'));
  }
  return grid;
}

/** Characters in the order they're laid out on the font sheet. */
export function fontChars(glyphs: GlyphMap): string {
  return Object.keys(glyphs).join('');
}

/** Top-left pixel of a character's cell on a sheet `charsPerRow` cells wide. */
export function cellPosition(index: number, charsPerRow: number): { x: number; y: number } {
  return {
    x: (index % charsPerRow) * CELL_WIDTH,
    y: Math.floor(index / charsPerRow) * CELL_HEIGHT,
  };
}

/** Replaces characters the font can't draw so nothing silently disappears. */
export function toFontText(
  text: string,
  glyphs: GlyphMap,
  substitutes: Readonly<Record<string, string>>,
): string {
  let out = '';
  for (const char of text) {
    if (char === '\n' || char in glyphs) out += char;
    else out += substitutes[char] ?? '?';
  }
  return out;
}

/** Pixel width of the widest line, without the trailing spacing column. */
export function measureText(text: string): number {
  const longest = Math.max(...text.split('\n').map((line) => [...line].length));
  return longest === 0 ? 0 : longest * CELL_WIDTH - 1;
}

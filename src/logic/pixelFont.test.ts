import { describe, expect, it } from 'vitest';
import { FONT_GLYPHS, FONT_SUBSTITUTES } from '../content/fontGlyphs';
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  GLYPH_HEIGHT,
  GLYPH_WIDTH,
  cellPosition,
  fontChars,
  measureText,
  parseGlyph,
  toFontText,
} from './pixelFont';

describe('font glyph data', () => {
  it('covers every printable ASCII character', () => {
    for (let code = 32; code <= 126; code++) {
      expect(FONT_GLYPHS, `missing "${String.fromCharCode(code)}"`).toHaveProperty(
        String.fromCharCode(code),
      );
    }
  });

  it('has only valid glyphs', () => {
    for (const [char, rows] of Object.entries(FONT_GLYPHS)) {
      expect(() => parseGlyph(rows), `glyph "${char}"`).not.toThrow();
    }
  });

  it('draws something for every character except space', () => {
    for (const [char, rows] of Object.entries(FONT_GLYPHS)) {
      const lit = parseGlyph(rows).flat().some(Boolean);
      expect(lit, `glyph "${char}"`).toBe(char !== ' ');
    }
  });

  it('only substitutes to characters the font has', () => {
    for (const replacement of Object.values(FONT_SUBSTITUTES)) {
      expect(toFontText(replacement, FONT_GLYPHS, {})).toBe(replacement);
    }
  });
});

describe('parseGlyph', () => {
  it('pads short glyphs to full height', () => {
    const grid = parseGlyph(['#...#']);
    expect(grid).toHaveLength(GLYPH_HEIGHT);
    expect(grid[0]).toEqual([true, false, false, false, true]);
    expect(grid[GLYPH_HEIGHT - 1]).toEqual(Array(GLYPH_WIDTH).fill(false));
  });

  it('rejects rows of the wrong width or with stray characters', () => {
    expect(() => parseGlyph(['####'])).toThrow();
    expect(() => parseGlyph(['##x##'])).toThrow();
  });

  it('rejects glyphs that are too tall', () => {
    expect(() => parseGlyph(Array(GLYPH_HEIGHT + 1).fill('.....'))).toThrow();
  });
});

describe('layout', () => {
  it('lists characters in sheet order', () => {
    expect(fontChars({ A: [], B: [], C: [] })).toBe('ABC');
  });

  it('wraps cells onto new rows', () => {
    expect(cellPosition(0, 16)).toEqual({ x: 0, y: 0 });
    expect(cellPosition(15, 16)).toEqual({ x: 15 * CELL_WIDTH, y: 0 });
    expect(cellPosition(16, 16)).toEqual({ x: 0, y: CELL_HEIGHT });
  });

  it('measures the widest line without trailing spacing', () => {
    expect(measureText('')).toBe(0);
    expect(measureText('A')).toBe(GLYPH_WIDTH);
    expect(measureText('AB\nABCD')).toBe(4 * CELL_WIDTH - 1);
  });
});

describe('toFontText', () => {
  it('keeps known characters and newlines', () => {
    expect(toFontText('Hi!\nOK', FONT_GLYPHS, FONT_SUBSTITUTES)).toBe('Hi!\nOK');
  });

  it('swaps typographic characters for ASCII', () => {
    expect(toFontText('ERP: tool — O(n²)', FONT_GLYPHS, FONT_SUBSTITUTES)).toBe(
      'ERP: tool - O(n^2)',
    );
  });

  it('turns unknown characters into ?', () => {
    expect(toFontText('विश्व', FONT_GLYPHS, FONT_SUBSTITUTES)).toMatch(/^\?+$/);
  });
});

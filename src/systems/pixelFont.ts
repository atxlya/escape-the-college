import Phaser from 'phaser';
import { FONT_GLYPHS, FONT_SUBSTITUTES } from '../content/fontGlyphs';
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  cellPosition,
  fontChars,
  measureText,
  parseGlyph,
  toFontText,
} from '../logic/pixelFont';

export const PIXEL_FONT = 'pixel';
const CHARS_PER_ROW = 16;

/**
 * Paints the glyph data onto a texture and registers it as a bitmap font.
 * Glyphs are white so `setTint` can colour them. Call once, before any text.
 */
export function registerPixelFont(scene: Phaser.Scene): void {
  if (scene.cache.bitmapFont.exists(PIXEL_FONT)) return;

  const chars = fontChars(FONT_GLYPHS);
  const rows = Math.ceil(chars.length / CHARS_PER_ROW);
  const texture = scene.textures.createCanvas(
    PIXEL_FONT,
    CHARS_PER_ROW * CELL_WIDTH,
    rows * CELL_HEIGHT,
  );
  if (!texture) throw new Error('Could not create pixel font texture');

  const ctx = texture.getContext();
  ctx.fillStyle = '#ffffff';
  [...chars].forEach((char, i) => {
    const origin = cellPosition(i, CHARS_PER_ROW);
    parseGlyph(FONT_GLYPHS[char] ?? []).forEach((row, y) =>
      row.forEach((on, x) => {
        if (on) ctx.fillRect(origin.x + x, origin.y + y, 1, 1);
      }),
    );
  });
  texture.refresh();

  scene.cache.bitmapFont.add(
    PIXEL_FONT,
    Phaser.GameObjects.RetroFont.Parse(scene, {
      image: PIXEL_FONT,
      width: CELL_WIDTH,
      height: CELL_HEIGHT,
      chars,
      charsPerRow: CHARS_PER_ROW,
      // Phaser's types use dotted keys here; its parser accepts them as-is.
      'offset.x': 0,
      'offset.y': 0,
      'spacing.x': 0,
      'spacing.y': 0,
      lineSpacing: 0,
    }),
  );
}

/** Adds crisp pixel text with its top-left on whole pixels. */
export function addPixelText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  colour: number,
): Phaser.GameObjects.BitmapText {
  return scene.add
    .bitmapText(
      Math.round(x),
      Math.round(y),
      PIXEL_FONT,
      toFontText(text, FONT_GLYPHS, FONT_SUBSTITUTES),
    )
    .setTint(colour);
}

/** Left edge that centres `text` in a span of `width` pixels, on a whole pixel. */
export function centredX(text: string, width: number): number {
  const shown = toFontText(text, FONT_GLYPHS, FONT_SUBSTITUTES);
  return Math.floor((width - measureText(shown)) / 2);
}

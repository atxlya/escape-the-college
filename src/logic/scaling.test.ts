import { describe, expect, it } from 'vitest';
import { integerZoom } from './scaling';

describe('integerZoom', () => {
  it('uses the exact multiple when the window matches', () => {
    expect(integerZoom(1280, 720, 320, 180)).toBe(4);
    expect(integerZoom(1920, 1080, 320, 180)).toBe(6);
  });

  it('rounds down so the game always fits', () => {
    expect(integerZoom(1366, 768, 320, 180)).toBe(4);
  });

  it('is limited by the tighter side', () => {
    expect(integerZoom(3000, 400, 320, 180)).toBe(2);
  });

  it('never goes below 1', () => {
    expect(integerZoom(200, 100, 320, 180)).toBe(1);
  });

  it('scales to 12x on a 4K screen', () => {
    expect(integerZoom(3840, 2160, 320, 180)).toBe(12);
  });
});

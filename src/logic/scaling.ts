/**
 * Largest whole-number zoom at which the game still fits the window.
 * Never below 1, so very small windows crop instead of shrinking.
 */
export function integerZoom(
  windowWidth: number,
  windowHeight: number,
  gameWidth: number,
  gameHeight: number,
): number {
  const fit = Math.min(windowWidth / gameWidth, windowHeight / gameHeight);
  return Math.max(1, Math.floor(fit));
}

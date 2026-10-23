import { describe, expect, it } from 'vitest';
import { Registry } from './registry';

describe('Registry', () => {
  it('returns what was registered, and undefined for unknown names', () => {
    const registry = new Registry<number>('Thing').register('a', 1).register('b', 2);
    expect(registry.get('a')).toBe(1);
    expect(registry.get('missing')).toBeUndefined();
    expect(registry.names()).toEqual(['a', 'b']);
  });

  it('refuses to register the same name twice', () => {
    const registry = new Registry<number>('Object type').register('Door', 1);
    expect(() => registry.register('Door', 2)).toThrow('Object type "Door" is already registered');
  });
});

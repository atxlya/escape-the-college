/**
 * Maps a name (e.g. a Tiled object type) to a value such as a factory function.
 * New entries plug in by registering; code that looks them up never changes.
 */
export class Registry<T> {
  private readonly entries = new Map<string, T>();

  constructor(private readonly label: string) {}

  register(name: string, value: T): this {
    if (this.entries.has(name)) throw new Error(`${this.label} "${name}" is already registered`);
    this.entries.set(name, value);
    return this;
  }

  get(name: string): T | undefined {
    return this.entries.get(name);
  }

  names(): string[] {
    return [...this.entries.keys()];
  }
}

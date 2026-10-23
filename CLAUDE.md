# Escape the College — rulebook

Pixel-art puzzle platformer. Bit, a CSE student, is trapped inside the MIT-WPU "system" and has to debug his way out.
Pico Park-style puzzles plus Mario-style platforming; Bit records ghost copies of himself instead of having co-op partners.
Every mechanic is a CS idea (Commit & Replay, Copy/Paste, Ctrl+Z, logic gates, pointers), and the ERP portal runs health, score and saving.

**docs/GDD.md is the manual; follow it.** If a task conflicts with the GDD, ask before changing course.
docs/PROGRESS.md tracks which sub-prompt is done and records decisions.

## Tech stack

- Phaser 3 (Arcade Physics, fixed 60 FPS step), TypeScript, Vite
- 320×180 game, 16×16 tiles, pixel art scaled up by whole numbers only
- Levels made in Tiled (maps in `public/maps`, tilesets in `public/tilesets`)
- Vitest for tests, ESLint + Prettier for style

| Command             | Does                                        |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Dev server with hot reload (port 5173)      |
| `npm run build`     | Typecheck, then production build to `dist/` |
| `npm run preview`   | Serve the built `dist/`                     |
| `npm test`          | Unit tests (Vitest)                         |
| `npm run typecheck` | TypeScript check only                       |
| `npm run lint`      | ESLint                                      |
| `npm run format`    | Prettier                                    |

## Folder map

- `src/scenes` – Phaser scenes (Boot → Preload → Game, later Title, Hub, levels)
- `src/entities` – game objects: Bit, ghosts, professors, crates, buttons, doors
- `src/systems` – Phaser-side managers: input, HUD, ERP pop-ups, pixel font, art registry
- `src/logic` – pure TypeScript game rules with Vitest tests; no Phaser imports (ESLint enforces it)
- `src/content` – `strings.ts` (all text), `palette.ts` (all colours and placeholder looks), font glyphs
- `src/config` – `tuning.ts` (feel and balance numbers), `controls.ts` (key bindings), `game.ts` (Phaser config)
- `public/maps` – Tiled level maps (JSON)
- `public/tilesets` – tileset images used by the maps
- `public/assets` – sprites and audio
- `scripts` – dev tooling (e.g. map checks)
- `docs` – GDD, progress checklist
- `images` – reference images and logo

## Rules

### Code placement

- Testable game logic goes in `src/logic` as pure TypeScript with Vitest tests next to it (`*.test.ts`).
  Phaser code in scenes, entities and systems calls into it; it never goes the other way.
- Every level element is set up from Tiled object properties, never hard-coded for one level.
  If a level needs something new, add a property type the loader understands, then use it in the map.

### Data files (single source of truth)

- All text (dialogue, ERP lines, professor catchphrases) lives in `src/content/strings.ts`,
  so the Hinglish lines can be swapped later. No string literals shown to the player anywhere else.
- All colours and placeholder looks live in `src/content/palette.ts`. No hex values elsewhere.
- All feel and balance numbers (speeds, gravity, jump, timers, damage, limits) live in `src/config/tuning.ts`.
- Controls live in `src/config/controls.ts`. Read keys from there, never hard-code a key in a scene.
  Defaults:

  | Action          | Keys         |
  | --------------- | ------------ |
  | Move            | A/D or ← / → |
  | Jump            | Space        |
  | Record ghost    | R            |
  | Throw ID card   | Q            |
  | Interact        | E            |
  | Terminal        | Tab          |
  | Copy / Paste    | C / V        |
  | Rewind (Ctrl+Z) | Z            |
  | Pointer swap    | X            |

### Art

- Characters are placeholder coloured blocks with name tags until pixel art is added.
- Code asks an art registry for a look by name (e.g. `'bit'`, `'aditi'`); it never draws a placeholder directly.
  Swapping in sprites later must only touch the registry, with no logic changes.

### Scope

- Don't build features from later parts unless asked. Do the current sub-prompt only.
- Small groundwork a sub-prompt needs is fine; note it in docs/PROGRESS.md.

### Style

- Simple, readable code. Short comments that say why, not what.
- Strict TypeScript: no `any`, no `@ts-ignore` without a comment explaining it.
- Keep pixel positions whole numbers so the art stays crisp.

## Definition of done (every task)

1. `npm run typecheck`, `npm run lint`, `npm test` and `npm run build` all pass.
2. No console errors in the browser (run the dev server and check).
3. docs/PROGRESS.md updated: tick the sub-prompt, add any decisions to Notes.
4. One git commit whose message starts with the sub-prompt number, e.g. `1.3: attendance meter`.

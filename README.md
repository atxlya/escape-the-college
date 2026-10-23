# Escape the College

**Play it: https://atxlya.github.io/escape-the-college/**

A pixel-art puzzle platformer. Bit, a CSE student, is trapped inside the MIT-WPU "system" and has to debug his way out.
It mixes Pico Park-style puzzles with Mario-style platforming, but instead of co-op partners Bit records ghost copies of himself.
Every mechanic is a CS idea (Commit & Replay, Copy/Paste, Ctrl+Z, logic gates, pointers), and the ERP portal runs health, score and saving.

Design: [docs/GDD.md](docs/GDD.md). Progress: [docs/PROGRESS.md](docs/PROGRESS.md).

Built with Phaser 3, TypeScript and Vite. 320×180 game, 16×16 tiles, scaled up by whole numbers.

## Run it locally

You need Node.js 22 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command              | Does                                         |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Dev server with hot reload                   |
| `npm run build`      | Typecheck, then production build to `dist/`  |
| `npm run preview`    | Serve the built `dist/`                      |
| `npm test`           | Unit tests (Vitest)                          |
| `npm run test:smoke` | Browser smoke test of the build (Playwright) |
| `npm run typecheck`  | TypeScript check only                        |
| `npm run lint`       | ESLint                                       |
| `npm run format`     | Prettier                                     |
| `npm run tiles`      | Regenerate the placeholder tileset           |

The smoke test needs a build first (`npm run build`) and a browser (`npx playwright install chromium`, once).

## Deploying

Every push to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml):
typecheck, lint, unit tests, build, smoke test, then publish to GitHub Pages.

## Folders

- `src/scenes` – Phaser scenes (Boot → Preload → Game)
- `src/entities` – game objects: Bit, ghosts, professors, crates
- `src/systems` – Phaser-side managers: input, HUD, ERP notifications
- `src/logic` – pure TypeScript rules, no Phaser imports (enforced by ESLint), unit-tested
- `src/content` – text (strings.ts) and colours + placeholder looks (palette.ts)
- `src/config` – game config, tuning numbers, controls
- `public/maps`, `public/tilesets`, `public/assets` – Tiled maps, tilesets, sprites and audio
- `scripts` – dev tooling
- `tests` – Playwright smoke tests
- `docs` – design docs, [LEVELS.md](docs/LEVELS.md) for editing maps in Tiled

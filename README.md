# Escape the College

Pixel-art puzzle platformer. Design: [docs/GDD.md](docs/GDD.md).

Phaser 3 + TypeScript + Vite. 320×180 game, 16×16 tiles, scaled up by whole numbers.

## Scripts

| Command             | Does                                        |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                  |
| `npm run build`     | Typecheck, then production build to `dist/` |
| `npm run preview`   | Serve the built `dist/`                     |
| `npm test`          | Unit tests (Vitest)                         |
| `npm run typecheck` | TypeScript check only                       |
| `npm run lint`      | ESLint                                      |
| `npm run format`    | Prettier                                    |

## Folders

- `src/scenes` – Phaser scenes (Boot → Preload → Game)
- `src/entities` – game objects: Bit, ghosts, professors, crates
- `src/systems` – Phaser-side managers: input, HUD, ERP notifications
- `src/logic` – pure TypeScript rules, no Phaser imports (enforced by ESLint), unit-tested
- `src/content` – strings and colours
- `src/config` – game config, tuning numbers, controls
- `public/maps`, `public/tilesets`, `public/assets` – Tiled maps, tilesets, sprites and audio
- `scripts` – dev tooling
- `docs` – design docs

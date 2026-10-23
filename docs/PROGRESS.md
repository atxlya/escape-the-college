# Progress

Tick a sub-prompt when it meets the definition of done in CLAUDE.md.

## Part 0: Setup

- [x] 0.1 Project skeleton
- [x] 0.2 Rulebook
- [ ] 0.3 Tiled pipeline
- [ ] 0.4 GitHub and deploy

## Part 1: Core feel

- [ ] 1.1 Bit's movement and camera
- [ ] 1.2 Placeholder art
- [ ] 1.3 Attendance and DETAINED
- [ ] 1.4 ERP HUD and pop-ups
- [ ] 1.5 Canteen checkpoints

## Part 2: Level 1-1 "Lecture Over?"

- [ ] 2.1 Level 1-1 Room A
- [ ] 2.2 Room B
- [ ] 2.3 Room C
- [ ] 2.4 Level end

## Part 3: Level 1-2 "Proxy"

- [ ] 3.1 Commit & Replay
- [ ] 3.2 Buttons, doors and gates
- [ ] 3.3 Level 1-2 Room A
- [ ] 3.4 Room B
- [ ] 3.5 Room C

## Part 4: Level 1-3 "Surprise Test"

- [ ] 4.1 Shital
- [ ] 4.2 Level 1-3 Room A
- [ ] 4.3 Deadline wall
- [ ] 4.4 Escape and report card

## Part 5: Front end

- [ ] 5.1 Intro cutscene
- [ ] 5.2 Title screen
- [ ] 5.3 Hub
- [ ] 5.4 Terminal
- [ ] 5.5 Report card, level select and saving

## Part 6: Website

- [ ] 6.1 Website
- [ ] 6.2 Feature GIFs

## Part 7: Polish

- [ ] 7.1 Bug fixes
- [ ] 7.2 Tuning

## Notes

Decisions made along the way, newest last.

- 0.1: Fixed 320×180 resolution with whole-number zoom (not Phaser's FIT) so pixels never blur.
- 0.1: Text uses a built-in 5×7 bitmap font instead of browser text, which anti-aliased at small sizes.
- 0.2: Renamed `src/content/colours.ts` to `palette.ts` (export `PALETTE`) to match the rulebook.
- 0.2: Default controls changed to the rulebook set; jump is Space only (Up and W removed). Not wired up yet.
- 0.2: `images/` holds source files only; anything the game loads is copied into `public/assets/`. Debug overlays (F1/F3) may use inline strings.

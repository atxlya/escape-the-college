# Escape the College — Game Design Document

*24 Oct 2026 · @Atulya*

---

## Overview

A pixel-art puzzle platformer where **Bit**, a CSE student, has to escape MIT-WPU. It mixes Pico Park's cooperative puzzles with Mario-style platforming, and every mechanic is built on a computer science concept.

- **Inspirations:** Pico Park (co-op puzzles), Super Mario (platforming, stomping enemies)
- **Player character:** Bit
- **Setting:** MIT-WPU, with levels in different campus venues: Aryabhatta, Vyas and World Peace Dome
- **Story:** Bit falls asleep in Shital ma'am's lecture. As punishment she locks him inside the college "system": *"Syllabus complete hone tak koi bahar nahi jayega."* Bit has to debug his way out.
- **Villain:** Shital, the Surprise Quiz Prof
- **System manager:** The ERP, the college portal that runs the world inside the system and manages attendance, CGPA, saving and notifications
- **Enemies:** Pixel versions of professors (Aditi, Kajal, Shital and more), plus system hazards
- **Goal:** Get through each venue and escape the college after the final boss at World Peace Dome
- **Co-op twist:** Instead of real partners, Bit records ghost copies of himself that act as friends
- **Level length:** Short, 2–4 minutes each, one main idea per level

---

## Core Mechanics

Five CS-themed tools drive every puzzle, with Commit & Replay as the main one.

### Commit & Replay (main mechanic)

- Press a key to start recording. Bit acts for up to 10 seconds.
- A ghost "commit" then replays those moves in a loop.
- Up to 3 ghosts at once. They are Bit's friends and replace Pico Park's co-op partners.
- Ghosts can hold buttons, be stood on, or carry boxes.

### Copy / Paste

- Copy one block (a crate, a platform or a spring) and paste it somewhere else.
- Each level gives a limited clipboard.

### Ctrl+Z

- Rewind the last 3 seconds.
- A few uses per level, so it works as both a puzzle resource and a forgiveness tool.

### Logic-Gate Wiring

- Switches connect to doors through visible AND, OR, NOT and XOR gates.
- Example: an AND door needs both buttons pressed, so a ghost has to hold one of them.
- XOR opens only when exactly one input is on.

### ID Card

- The lanyard opens turnstiles.
- It can be thrown like a boomerang to hit distant switches.
- If it lands somewhere unreachable, Bit loses access until getting it back.

---

## Puzzle Mechanics

Level elements based on data structures, memory and logic add variety on top of the core tools.

### Data-Structure Platforms

- **Stack platforms (LIFO):** A button pushes a platform onto a pile; popping removes only the top one. The bottom platform is reachable only by taking apart the ones above it.
- **Queue conveyor (FIFO):** Crates enter one end and leave the other in strict order. Load them in the right sequence to build a staircase at the far end.
- **Linked-list bridges:** Each plank points to the next. Break a link with the ID card and everything after it falls.

### Memory and Pointers

- **Pointer swap:** Tag any object, then press a key to swap places with it instantly. Works with ghosts too, swapping into a ghost's position mid-loop.
- **Garbage collector:** Objects nobody has referenced (touched, stood on or carried) in the last 15 seconds are deleted. Ghosts must touch important crates now and then to keep them alive.
- **Memory leak:** A rising floor of junk blocks slowly fills the room, acting as a soft timer.
- **Null pointer pits:** Look like normal floor until stepped on. A ghost walking ahead can reveal them.

### Logic and Computation

- **Binary blocks:** Red "1" blocks and blue "0" blocks swap solidity every time Bit jumps, like Mario's on/off switches.
- **XOR gate:** Opens only when exactly one input is on. Pairs with the AND, OR and NOT gates.

---

## Hazards and Enemies

System hazards punish careless movement, and professor enemies each disrupt a different tool.

### Hazards

| Hazard | What it does | Counterplay |
|---|---|---|
| Firewall lasers | Block only Bit | Ghosts can pass through them |
| Popup ads | Windows slide in and act as solid walls | Close them to clear the path |
| Lag zones | Everything moves at half speed, including jumps | Plan timing around the slowdown |

### Professor Enemies

> Names and lines below are demo versions. Pixel sprites and the final Hinglish catchphrases come later; until then each professor is a coloured placeholder block.

| Enemy | Name | Behavior | Effect on Bit | Placeholder look | Demo line |
|---|---|---|---|---|---|
| Patrolling Professor | Aditi | Paces back and forth along platforms and corridors, the basic enemy in every level | Stomp Mario-style; some split into two TAs when stomped. Touching one costs attendance | Orange block with a name tag | "Kahan ja rahe ho? Class abhi khatam nahi hui!" |
| Attendance Taker | Kajal | Watches through a sweeping CCTV camera | Caught = sent back to the last checkpoint, unless a ghost is standing proxy | Purple block with a CCTV camera and a yellow vision cone | "Proxy maar rahe ho? Sab dikh raha hai mujhe." |
| Surprise Quiz Prof (villain) | Shital | Throws quiz papers in arcs | Each hit costs attendance | Bigger red block holding a stack of papers | "Surprise test! Sab book band karo." |
| Viva Examiner | Not named yet | Blocks a doorway and asks a quick CS question | Right answer = pass; wrong answer = take a hit | Not decided yet | Not written yet |
| Phone Confiscator | Not named yet | Chases and touches Bit | Steals one clipboard slot | Not decided yet | Not written yet |

### Final Boss: World Peace Dome

Three phases named after the real semester, each forcing Bit to combine every mechanic learned so far.

1. **LCA/CCA:** Dodge quiz papers while ghosts hold two AND-gate buttons.
2. **Mid-Sem:** The arena floor is a stack, and the boss pops platforms out from under Bit.
3. **End-Sem:** A memory leak fills the dome while Bit chains pointer swaps and Ctrl+Z to reach the final switch.

> **Open question:** Is the final boss Shital, returning for her three exam phases?

---

## College-Life Systems

Health, score and saving all use college vocabulary, which gives the game its personality. The ERP runs all of them (next section).

- **Attendance meter (health):** Bit loses percentage points when hit. Below 80%, Bit is "detained" or gets a back, which means game over.
- **CGPA (score):** Collect grade points through levels. A 10.0 run earns an S-rank.
- **Proxy attendance:** Some doors need Bit marked present in several rooms at once, so ghosts give proxy. This is the lore reason for the ghost mechanic.
- **Canteen checkpoints:** Grab a cold coffee or pasta to save progress.
- **Assignment deadline wall:** Auto-scrolling chase levels where a wall of papers pushes Bit forward.
- **Library silence zone:** Jumping or landing makes noise, and noise wakes the librarian.
- **Wi-Fi dead zones:** Copy/Paste and Ctrl+Z don't work inside them.

---

## ERP: The System Manager

The ERP is the college portal, and inside the system it runs everything. It is not a villain and takes no side: it tracks, records and announces, in a dry, official voice. Shital is the villain; the ERP only enforces the rules.

### What the ERP Manages

- **Attendance (health):** Updates the attendance meter after every hit. Below 80%, it stamps "DETAINED" on the screen and the level restarts.
- **CGPA (score):** Counts grade points collected in each level and keeps a running CGPA across the game.
- **Report card:** Shown at the end of every level, with CGPA, attendance left, time taken and a rank (S, A, B or C). A 10.0 CGPA run earns S. All report cards can be viewed from the hub.
- **Saving:** Every Canteen checkpoint registers with the ERP ("Progress saved"), and Continue in the hub loads the last one.
- **Tool unlocks and limits:** Announces each new tool, and tracks ghost slots (0/3), clipboard slots and Ctrl+Z uses left.
- **Level unlocks:** Opens new worlds in the hub: the Vyas door after World 1, the World Peace Dome door after World 2.
- **Notifications:** Short pop-ups for checkpoints, new tools and warnings, such as entering a Wi-Fi dead zone, a lag zone or a rising memory leak.

### On Screen (HUD)

| Position | Shows |
|---|---|
| Top left | Attendance meter. Starts at 100%, turns yellow between 86–89%, and red at 85% or below |
| Top right | CGPA counter and ghost slots |
| Top centre | ERP notifications. They slide in, stay about 2 seconds and slide out, and never pause the game |
| End of level | Full-screen ERP report card |

### Example ERP Lines

*(Demo; Hinglish versions to be added later)*

- "ERP: Attendance updated — 92%"
- "ERP: CGPA +0.5"
- "ERP: Progress saved."
- "ERP: New tool unlocked — Commit & Replay (1/3 ghosts)."
- "ERP: Warning — Wi-Fi dead zone. Copy/Paste and Ctrl+Z unavailable."
- "ERP: Attendance below 80%. Status: DETAINED."
- "ERP: Semester 2 has begun. Vyas unlocked."

---

## Worlds and Progression

Three venues, each themed as a semester, introduce new mechanics before the boss tests all of them. World 1 has 3 levels; level counts for Worlds 2 and 3 are not decided yet.

| World | Theme | Mechanics taught | Hazards | Enemies | Set piece |
|---|---|---|---|---|---|
| 1. Aryabhatta (Classroom) | Tutorial semester | Movement, stomping, Commit & Replay, ID card, AND/OR gates, binary blocks, proxy doors | None (enemies only) | Aditi (Patrolling Professor), Kajal (Attendance Taker, CCTV), Shital (Surprise Quiz Prof) | Deadline-wall chase out of the classroom |
| 2. Vyas (CSE building) | Data-structures semester | Stack platforms, queue conveyors, linked-list bridges, XOR/NOT gates, Copy/Paste, garbage collector, null pointer pits | Firewall lasers, popup ads, Wi-Fi dead zones in labs | Viva Examiner at lab doors, Phone Confiscator | Library silence zone stealth level |
| 3. World Peace Dome | Exam season | Pointer swap, Ctrl+Z as a core tool, lag zones, memory leak timers, plus every mechanic from Worlds 1 and 2 | Lag zones, memory leak | None (boss only) | Three-phase boss: LCA/CCA, Mid-Sem, End-Sem |

Canteen checkpoints appear in every world, and CGPA pickups reward exploring off the main path.

---

## Landing Page, Intro and Hub

The game has a website and an in-game front end. Both use a pixel-art MIT-WPU campus as the background and the MIT-WPU logo, whose dome is World Peace Dome, the final destination.

### Website

One scrolling page:

- **Hero:** Pixel-art MIT-WPU campus with a slight glitch flicker, the logo, and a big Play button
- **Story:** Two lines: *"Bit fell asleep in class. Now the campus is a program, and it won't let him leave."*
- **Features:** One card per mechanic with a short looping GIF (Commit & Replay, Copy/Paste, Ctrl+Z, logic gates, ID card, pointer swap, data-structure platforms, garbage collector)
- **College life:** Attendance meter, CGPA, proxy attendance, Canteen checkpoints
- **Worlds:** Cards for Aryabhatta, Vyas and World Peace Dome
- **Faculty gallery:** The professor enemies as trading cards
- **Controls, credits, and a final Play button**

### Intro Cutscene (first launch, skippable)

1. **Aryabhatta classroom, 4:58 PM:** Wooden benches in 4 columns, blackboard, ceiling fans, grill windows. Shital ma'am drones on: *"...so the time complexity becomes O(n²), which will come in the exam..."* Bit is on the back bench: *"Zzz..."*
2. The clock ticks to 4:59. Bit's laptop flickers: `COLLEGE.exe has stopped responding.`
3. The screen glitches, the pixels tear, and Bit is pulled into the laptop.
4. Black screen, boot text: `BIOS v2.0 ... loading CAMPUS / Student detected: BIT / Attendance: 100% / ERROR: exit_door not found.`
5. It glitches into the title screen.

### Title Screen

The pixel MIT-WPU campus, the logo with its dome flickering like a corrupted file, and a blinking `> press any key_`.

### Hub (Walking and Terminal)

A small pixel lobby. Bit walks to each option, or the player presses **Tab** to open a terminal bar and type commands. On the first visit, walking around the hub teaches movement and jumping.

| Walk to | Terminal command | Opens |
|---|---|---|
| Classroom door | `> continue` | Continue from the last Canteen checkpoint |
| Notice board | `> map` | Level select / world map |
| Exam cell window | `> report` | Report card (CGPA, rank, attendance per level) |
| Help desk poster | `> help` | Controls / how to play |
| Computer in the corner | `> settings` | Settings |

The hub changes as Bit progresses: the Vyas door unlocks after World 1, the Dome door after World 2, and glitches spread through the lobby with each world.

> **Easter egg:** `sudo exit` replies *"Bit is not in the sudoers file. This incident will be reported to the HOD."*

---

## World 1: Aryabhatta Levels

Three short levels take Bit from Shital's classroom out onto the campus. Each level has three rooms.

### Level 1-1: "Lecture Over?"

**Teaches:** Walking, jumping, stomping, binary blocks, ID card · **Enemy:** Aditi · **Length:** About 3 minutes

- **Room A, the classroom:** The intro classroom, now glitched. The 4 columns of benches at different heights are the first platforms, the blackboard flickers with error text, and the fan blades are timed platforms. The grill windows show the campus outside but can't be passed. ERP: *"Lecture in progress. Exit not permitted."*
- **Room B, the corridor:** Aditi paces the corridor; stomp her, or lose 5% attendance on contact. Red and blue binary blocks over a gap swap every time Bit jumps. CGPA pickups sit on harder side routes.
- **Room C, the turnstile:** Bit finds his lanyard (ERP: *"ID card detected."*). A turnstile opens with the card, and a high switch needs a boomerang throw.
- **End beat:** Shital on the PA: *"Bit! Class se bahar? Attendance cut."*

### Level 1-2: "Proxy"

**Teaches:** Commit & Replay, standing on ghosts, carrying boxes, AND/OR gates, proxy doors · **Enemies:** Kajal, Aditi · **Length:** About 4 minutes

- **Room A, two buttons:** An AND-gate door needs two buttons at once. A glitched terminal shows `git commit -m "friend"` and unlocks Commit & Replay. Bit records a ghost on button 1 and presses button 2 himself. ERP: *"New tool unlocked — Commit & Replay (1/3 ghosts)."*
- **Room B, group project:** A ledge too high to jump to (stand on a ghost's head); a ghost carries a box onto a button; an OR-gate door with a hidden shortcut and extra CGPA. Bit: *"Finally, a group project where everyone does their part."*
- **Canteen checkpoint:** Cold coffee.
- **Room C, Kajal's corridor:** A CCTV camera sweeps the corridor; being seen sends Bit back to the checkpoint. A proxy door needs Bit present in two rooms, so a ghost stands on a "PRESENT" spot. If Kajal spots Bit while a ghost is standing proxy, the ghost takes the blame.

### Level 1-3: "Surprise Test"

**Teaches:** Dodging, combining tools, the deadline-wall chase · **Enemy:** Shital (mini-boss) · **Length:** About 4 minutes

- **Room A, the surprise quiz:** Shital on the teacher's platform: *"Surprise test! Sab book band karo."* Quiz papers fly in arcs (10% attendance per hit) while Bit solves a gate puzzle needing 2 ghosts and an ID-card throw.
- **Canteen checkpoint:** Pasta.
- **Room B, the deadline wall:** Shital: *"Assignment submission abhi... 5 minute mein!"* A wall of papers scrolls in from the left. A fast run through binary blocks, a quick ghost-on-button and an Aditi stomp.
- **Room C, escape:** Bit bursts out of the Aryabhatta main door onto the campus as the wall crashes behind him. Shital, from a window: *"Semester 2 mein milte hain, Bit."* ERP report card, then the Vyas door unlocks in the hub.

### What to Build for World 1

- **Tiles:** Wooden benches (4-column layout), blackboard, ceiling fans, grill windows, corridor floor and walls, turnstile, canteen counter, Aryabhatta main door
- **Objects:** Buttons, doors, AND/OR gate wiring, binary blocks, boxes, CCTV camera with vision cone, "PRESENT" proxy spots, CGPA pickups
- **Systems:** Commit & Replay, ID-card throw, attendance health, ERP HUD and pop-ups, checkpoints, scrolling deadline wall, Shital's paper throws
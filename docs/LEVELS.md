# Levels

Levels are drawn in [Tiled](https://www.mapeditor.org/) and loaded by `src/systems/LevelLoader.ts`.
Nothing about a level is hard-coded: tiles, collision and objects all come from the map file.

## Files

| Path                                | What it is                                                     |
| ----------------------------------- | -------------------------------------------------------------- |
| `public/maps/<key>.tmj`             | One map per level, Tiled JSON. The game loads it by `<key>`.   |
| `public/tilesets/placeholder.png`   | Placeholder tile art, generated.                               |
| `public/tilesets/placeholder.tsj`   | Tiled tileset for it, with tile properties, generated.         |
| `scripts/make-placeholder-tiles.mjs`| Generates both files above. Run `npm run tiles` after editing. |

The placeholder tileset is generated, so don't edit `placeholder.tsj` in Tiled: change the `TILES`
list in the script and run `npm run tiles`. Add new tiles at the end of the list so existing maps
keep pointing at the right tiles. Tile colours come from `PALETTE.tiles` in `src/content/palette.ts`.

## Opening and editing a map

1. Install Tiled 1.10 or newer (`brew install --cask tiled` on macOS).
2. In Tiled, **File > Open** and pick `public/maps/test-room.tmj` (or any `.tmj` in that folder).
   The tileset loads automatically from `../tilesets/placeholder.tsj`.
3. Paint with the tileset panel. Pick the layer first in the Layers panel (see below).
4. To add an object, select the **Objects** layer, use the point or rectangle tool, then set the
   object's **Class** (called Type in older Tiled) to one of the types in the table below, and add its
   custom properties.
5. **File > Save** (Ctrl/Cmd+S). Keep the format as JSON (`.tmj`). The dev server picks up the change
   on reload.

New map: **File > New > New Map**, Orthogonal, tile size 16×16, **Fixed** size (infinite maps are
rejected), save as `public/maps/<key>.tmj`. Add the tileset with **Map > Add External Tileset** and
pick `public/tilesets/placeholder.tsj`; don't embed it. Then create the layers below.

To open a map in the game, preload it with `LevelLoader.preload(key)` and build it with
`LevelLoader.build(key)`. For now the Game scene opens `START_LEVEL` from `src/config/levels.ts`.

## Layers

Tile layers are drawn in the order they appear in the map, bottom first.

| Layer        | Kind         | What goes on it                                                                         |
| ------------ | ------------ | --------------------------------------------------------------------------------------- |
| `Background` | Tile layer   | Back-wall art: grill windows and other scenery. Never collides.                         |
| `Ground`     | Tile layer   | Required. Floors, walls, platforms, spikes. The only layer whose tiles collide.         |
| `Decor`      | Tile layer   | Front details such as the blackboard. Never collides.                                   |
| `Objects`    | Object layer | Everything that isn't a tile: spawn points and, later, buttons, doors, professors etc. |

More tile layers are allowed and are drawn as decoration.

## Tile properties

Set per tile in the tileset (the script writes them). The loader reads them on the `Ground` layer only.

| Property   | Type | Effect                                                                         |
| ---------- | ---- | ------------------------------------------------------------------------------ |
| `collides` | bool | Solid on all four sides.                                                       |
| `oneWay`   | bool | With `collides`: solid only from above, so you can jump up through it.         |
| `hazard`   | bool | Marks tiles that hurt (spikes). Not acted on yet; damage arrives with Bit.     |

### Placeholder tiles

| Id  | Tile               | collides | oneWay | hazard |
| --- | ------------------ | -------- | ------ | ------ |
| 0   | Solid floor        | yes      |        |        |
| 1   | Wall               | yes      |        |        |
| 2   | One-way platform   | yes      | yes    |        |
| 3   | Wooden bench       | yes      | yes    |        |
| 4   | Blackboard         |          |        |        |
| 5   | Grill window       | yes      |        |        |
| 6   | Spikes             |          |        | yes    |

The grill window is marked solid so it can be built into walls on `Ground`; on `Background` it's
just scenery.

## Object types

Each object's **Class/Type** picks a factory from the registry in `src/systems/levelObjects.ts`.
To add a type, register a factory there (and add a row here); the loader doesn't change.
Objects with an unknown type are skipped with a console warning.

Positions are in pixels from the map's top-left. For point objects that's the point; for
rectangles it's the top-left corner.

| Type          | Shape | Properties | What it does                                                                   |
| ------------- | ----- | ---------- | ------------------------------------------------------------------------------ |
| `PlayerSpawn` | Point | none       | Where Bit starts. Place it on the floor surface. One per map; the first wins. |

## Debug

- **Arrow keys** pan the camera (until Bit exists and the camera follows him).
- **F1** toggles physics debug: colliding tiles in pink, their solid edges in cyan (one-way tiles
  show only a top edge), Arcade body outlines, and a yellow marker at each object.

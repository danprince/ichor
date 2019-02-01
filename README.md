# Design Notes

## Items

* Weapons (increase/affect melee damage)
* Trinkets (passive effects)
* Spells (use for effect)
* Consumables (eat for effect)

Items can be dropped (d)
Items can be used (Enter)

Items should probably be entities, so that we can manipulate them.

To make this into a demo, it needs:
* UI layer
* Enemy hostility
* Map load event chain
* Map spawn event chain
* Tutorial

## Backlog
- [x] Messaging UI
- [x] FOV
- [ ] Combat
- [ ] Camera
- [ ] Items/slots
- [ ] Containers
- [ ] Prompt/dialog
- [ ] Sounds
- [ ] Level generation
- [ ] Spells
- [ ] Tutorial
- [ ] Cursor/targeting

Dungeon made up of a network of 11x11 rooms that can be connected on any side.

Made some good progress on FOV, messages and the beginnings of combat and AI.

Want to move the HUD onto a separate canvas, so that it's easy to move it around the UI for different layouts (e.g. above the message log).

Want to work on connecting areas. How do we manage spawns between areas? The simplest way to start would be to just move everything from the last room into memory and load the new one into the game.

Screen transitions by waiting for the player to try to move out of the map dimensions.

Do we actually need multiple levels or could one playthrough be set in one
big dungeon? Could try generating/populating the rooms on-demand as the player leaves each one?

Would make it much easier to add a minimap at some point.

Could configure the dungeon length to be a specific number of rooms in the initial settings. Make sure that the final boss/puzzle is a minimum distance away from the start.

First version can just be a list of random rooms and a list of preset rooms. Each room should measure its distance from the starting room (might have to run dijkstra's after any new room is added).

Absolute first step will be to get the dungeon structure right and hardcode a complete layout of rooms.

Eventually it would be cool to add vertical exits too, but that's too far out of scope for now. Towers/pits.

Hopefully make the preset rooms visually distinct. Will need some global flags/handlers to be aware of what's already been created in the dungeon. Don't want to spawn the same preset twice / duplicate items etc.

Inspiration from spelunky for making entities as simple as possible. Should think about the enemy AI. They really did a good job at keeping the core set of "components" or entity properties down.

https://www.rockpapershotgun.com/2016/03/04/making-of-spelunky/2/

# Can't sleep! Notes incoming.

* Dungeon generator should be a state machine (start, connect, end, reject). See dan abramov post on complexity bug(O) recently.
* Dungeon generator should work with a dungeon draft, not a real dungeon. The draft should be made of templates, not real room objects. Then we don't have to worry about legend etc.
* Dungeon generator should have limits for how many of 1 type of room to generate. E.g. some presets should be unique.
* Draft nodes still need the grid, otherwise it's tricky to tell which spots are free / where the adjacent nodes are. Probably want a graph traversal friendly interface for getting the links from each node, by inference from the map.
* Should forward all events that arrive at the player down to the items in their inventory.
* Define actions that take an entity and the game state. Have an energy cost and can return alternate action.
* Should have a central hub that includes the tutorial rooms, a graveyard etc
* Move all templates for hub into separate file and have templates file just export a big list.
* Still need to separate the UI onto separate canvases.
* Could put upgrade tree / crafting UI onto separate canvases.
* Achievements handler which listens to all kinds of events and stores them.
* Need to think about how the templates should specify which tiles are good for which spawns.
* DungeonSpawnEvent
* Onscreen prompt actions like tooltips (e.g. buy from shop etc)
* Multi-tile entities?
* Fountain of blood should run out and switch sprite.
* Add a bloodworm monster, add leech varieties
* How would we theme areas of the dungeon? E.g. set style of walls and entities that spawn, not for one room, but for rooms all around. Early warning system as you come towards rooms with difficult encounters or special items.
* Could rooms specify a preference for neighbouring rooms?
* Could add portals for teleporting between rooms. This would allow linking disconnected pieces of map.
* Floodfill the dungeon generator to make sure all paths are connected
* Multiple endings based on what the "end" tile is? Could use the end tile to theme the rest of the dungeon?
* Any way to make an endless dungeon that just generates more rooms on demand?
* World level events for moving between dungeons? E.g. like spelunky bonus levels.
* Read a bit more about graph grammars for level generation. Would be great to include proper puzzles which actually linked level areas together with logical journeys etc.
* Minimap should probably have a camera, so that you could play in a huge dungeon without issue.
* Thinking a bit about saving again. Can't just save seed + entities because even tiny changes to the generator will mess up seeds. Need so many classes to implement serialization...
* Need to bring back the registry to support saving properly.
* Want to rework the renderer model to make a more generic renderer that can handle sprites fine. Bonus points if it supports upscaled rendering too.
* Terrain types need a colour for the minimap to be able to handle them correctly.
* Wondering about making FX a first class citizen, like entities are. Could make them a pure renderer concern and send them to the renderer via an event. Sounds good!
* Could do more complex template stitching by getting the binary pattern for each cardinal direction (e.g. 111111111101111) shows a gap of 1 block. Would mean it would be possible to connect far more interesting templates together.
* Could make the tilemap parser pluggable, to support autotiling etc.
* Some kind of component that marks an entity as fixed, so that they are never unloaded and stored with a room?
* How to prevent the "turn" event when an action was unsuccessful? E.g. walked into a wall.
* How should the animation system work? The renderer shouldn't really know about the game entities.
* Giving up on mouse support for now. Can revisit that later.
* Could have a renderer mode that ignores animations / fx and only renders after turn events.

```
// Going to be an enormous blob of JSON.

type SavedGame = {
    player: Serialized<Entity>;
    dungeon: Serialized<Dungeon>;
    events: Serialized<Event[]>;
    statistics: Serialized<Statistics>;
};

type SerializedDungeon = {
    rooms: SerializedRoom[];
}

type SerializedRoom = {
    entities: SerializedEntity[];
    tiles: SerializedTileMap[];
};
```

# UI Ideas

```
+---------------------------------------+
|                          |            |
|                          |     MAP    |
|                          |            |
|                          |------------|
|                          | HP 1  2  3 |
|                          |------------|
|                          | LOG        |
|                          |            |
|                          |            |
|                          |            |
+---------------------------------------+
```


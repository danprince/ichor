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

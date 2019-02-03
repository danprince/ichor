# Ichor

Ichor is a roguelike where the player attempts to manage their blood supply, whilst exploring a randomly generated dungeon. It is largely inspired by the Dark Souls series of games.

## TODO
* Make FX a first class renderer concern (driven by events)
* Combat
* Inventory
* Containers
* Prompts / dialogs
* Sounds
* Spells
* Tutorials
* Mouse
* Worms + leeches

## Items
* Categories:
  * Weapons (increase/affect melee damage)
  * Trinkets (passive effects)
  * Spells (use for effect)
  * Consumables (eat for effect)
* Items can be dropped (d)
* Items can be used (Enter)

## Dungeon Generation

* What about starting with a single exit end tile? Then pick the spawn tile based on distance from the end?
* Could we make a dungeon mode where rooms are generated on demand?

### Algorithm
* Start with an empty grid of NxM cells
* Create an empty stack of nodes
* Pick a random position to be the _origin_ (can't be an edge)
* Create a start node at the _origin_
  * Create a candidate node from each of the "start" templates
  * For each candidate node
    * Assign a score
    * If score is < 0, reject it
    * Pick a random node from the remaining candidates
* Commit the start node
  * Place it on the grid
  * Push it onto the stack
* While there are nodes on the stack
  * Pop a node
  * For each exit in the current node
    * Create a connector node in the adjacent tile
    * Commit the connector node

```

## Stretch Goals
* Vertical levels
* Achievements handler
* Stats handler
* Disconnected dungeons + portals
* Battery friendly renderer (only render after turn event)

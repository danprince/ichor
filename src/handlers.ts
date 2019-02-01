import { PermissiveFov } from "permissive-fov";
import { Event, Entity, Handler, Game } from "./engine";
import { Sprites } from "./sprites";
import { Dungeon } from "./dungeon";
import * as Events from "./events";
import * as Components from "./components";
import config from "./config";

export class ScriptingHandler extends Handler {
  Event(event: Event) {
    let entities = this.game.findEntitiesWith(Components.Scripts);

    for (let entity of entities) {

      // This event is for another entity, skip this one.
      if (event.entity && event.entity !== entity) {
        continue;
      }

      let { scripts } = entity.get(Components.Scripts);

      for (let script of scripts) {
        let handler = script[event.constructor.name];

        if (handler) {
          handler(entity, event, this.game);
        }
      }
    }
  }
}

export class MovementHandler extends Handler {
  EntityMoveByEvent(event: Events.EntityMoveByEvent) {
    let { entity, x, y } = event;
    let origin = entity.get(Components.Position);
    this.game.post(new Events.EntityMoveEvent(entity, origin.x + x, origin.y + y));
  }

  EntityMoveEvent(event: Events.EntityMoveEvent) {
    let { entity, x, y } = event;
    let origin = entity.get(Components.Position);

    // Entity is already at the target
    if (origin.is(x, y)) {
      return;
    }

    // Blocked by the boundaries of the map
    if (this.game.tiles.isOutside(x, y)) {
      return this.game.post(new Events.BoundsBlockEvent(entity, x, y));
    }

    let enterTile = this.game.getTile(x, y);
    let exitTile = this.game.getTile(origin.x, origin.y);

    // We're blocked by the destination tile type
    if (enterTile.type.walkable === false) {
      return this.game.post(new Events.TileBlockEvent(entity, enterTile, x, y));
    }

    let entitiesOnTile = this.game
      .findEntitiesWith(Components.Position)
      .filter(entity => entity.get(Components.Position).is(x, y));

    for (let target of entitiesOnTile) {
      this.game.post(new Events.EntityTouchEvent(entity, target));
      this.game.post(new Events.EntityTouchedEvent(target, entity));
    }

    let blockingEntities = entitiesOnTile.filter(
      entity => entity.has(Components.Blocking));

    // We've been blocked by entities on the destination tile
    for (let blockingEntity of blockingEntities) {
      this.game.post(new Events.EntityBlockEvent(entity, blockingEntity));
    }

    // We're blocked by entities on the destination tile
    if (blockingEntities.length > 0) {
      return;
    }

    // Displace all of the entities that we're now stood with
    for (let target of entitiesOnTile) {
      this.game.post(new Events.EntityDisplaceEvent(entity, target));
    }

    this.game.post(new Events.TileExitEvent(entity, exitTile, origin.x, origin.y));
    this.game.post(new Events.TileEnterEvent(entity, enterTile, x, y));

    // Update the coordinates
    let position = entity.get(Components.Position);
    position.x = x;
    position.y = y;
  }
}

export class DoorHandler extends Handler {
  EntityTouchedEvent(event: Events.EntityTouchedEvent) {
    let { entity } = event;
    let openable = entity.get(Components.Openable);
    let sprite = entity.get(Components.Sprite);

    if (openable && sprite) {
      entity.remove(Components.Blocking);
      sprite.id = openable.sprite;
    }
  }
}

export class VisionHandler extends Handler {
  // TODO: Remove hardcoded map dimensions
  fov = new PermissiveFov(
    11,
    11,
    (x, y) => this.game.getTile(x, y).type.transparent
  );

  StartEvent(event: Events.StartEvent) {
    this.update();
  }

  TurnEvent(event: Events.TurnEvent) {
    this.update();
  }

  update() {
    let player = this.game.findEntityByTag("player");
    let { x, y } = player.get(Components.Position);
    let radius = 5;

    for (let [x, y, tile] of this.game.tiles) {
      tile.visible = false;
    }

    this.fov.compute(x, y, radius, (x, y) => {
      let tile = this.game.getTile(x, y);
      tile.visible = true;
    });
  }
}

export class CombatHandler extends Handler {
  EntityTouchEvent(event: Events.EntityTouchEvent) {
    let { entity, target } = event;

    // TODO: Better test for whether a target is attackable.
    if (entity.hasTag("player") && target.has(Components.Attackable)) {
      this.game.post(new Events.PlayerAttackEvent(target));
    }
  }

  PlayerAttackEvent(event: Events.PlayerAttackEvent) {
    // TODO: Calculate how much damage the player will do to this target.
    let dmg = 1;

    let message = `You did ${dmg} damage to it!`;

    if (event.target.has(Components.Name)) {
      let name = event.target.get(Components.Name).value;
      message = `You did ${dmg} damage to the ${name.toLowerCase()}!`;
    }

    let player = this.game.findEntityByTag("player");
    this.game.post(new Events.DealDamageEvent(event.target, player, dmg));
    this.game.post(new Events.MessageEvent(message, "action"));
  }
}

export class DamageHandler extends Handler {
  DealDamageEvent(event: Events.DealDamageEvent) {
    let { entity, dealer, amount } = event;
    let blood = entity.get(Components.Blood);

    if (blood) {
      let damage = blood.change(-amount);

      // Update the event to show how much damage was actually done.
      event.amount = damage;

      this.game.post(new Events.DealtDamageEvent(entity, dealer, damage));

      if (blood.isEmpty()) {
        this.game.post(new Events.EntityDestroyEvent(entity));
      }
    }
  }
}

export class MessagingHandler extends Handler {
  constructor() {
    super();
  }

  EntityTouchEvent(event: Events.EntityTouchEvent) {
    let { entity, target } = event;

    let message = target.get(Components.Message);

    if (entity.hasTag("player") && message) {
      this.game.post(new Events.MessageEvent(message.value, message.channel));
    }
  }
}

export class DestructionHandler extends Handler {
  EntityTouchEvent(event: Events.EntityTouchEvent) {
    let { entity, target } = event;

    // If the target is breakable, destroy it
    if (target.has(Components.Breakable)) {
      this.game.post(new Events.EntityDestroyEvent(target));
    }
  }

  EntityDestroyEvent(event: Events.EntityDestroyEvent) {
    let { entity } = event;
    let breakable = entity.get(Components.Breakable);

    if (breakable) {
      let corpse = Entity.with(
        new Components.Sprite(breakable.sprite),
        new Components.Layer(-1),
        entity.get(Components.Position),
      );

      this.game.addEntity(corpse);
    }

    this.game.removeEntity(entity);
  }
}

export class TurnHandler extends Handler {
  turns = 0;

  Event(event: Event) {
    switch (event.constructor) {
      // TODO: Don't waste a turn if the player couldn't actually do that
      // Take inspiration from Bob Nystrom's action system, where each actor
      // Gets input before performing their action. The action can succeed,
      // fail, or return an alternate action.
      case Events.MoveNorthEvent:
      case Events.MoveSouthEvent:
      case Events.MoveWestEvent:
      case Events.MoveEastEvent:
      case Events.MoveNorthWestEvent:
      case Events.MoveNorthEastEvent:
      case Events.MoveSouthWestEvent:
      case Events.MoveSouthEastEvent:
      case Events.SlotUseEvent:
        this.turns += 1;
        this.game.post(new Events.TurnEvent);
    }
  }
}

export class EnergyHandler extends Handler {
  TurnEvent(event: Events.TurnEvent) {
    let entities = this.game.findEntitiesWith(Components.Energy);

    for (let entity of entities) {
      entity.get(Components.Energy).charge();
    }
  }
}

export class AIHandler extends Handler {
  TurnEvent(event: Events.TurnEvent) {
    let entities = this.game.findEntitiesWith(
      Components.Brain,
      Components.Energy,
    );

    for (let entity of entities) {
      let energy = entity.get(Components.Energy);

      if (energy.value < 1) {
        continue;
      } else {
        energy.reset();
      }

      if (entity.has(Components.Mobile, Components.Position)) {
        let x = Math.round(Math.random() * 2) - 1;
        let y = Math.round(Math.random() * 2) - 1;
        this.game.post(new Events.EntityMoveByEvent(entity, x, y));
      }
    }
  }
}

export class DungeonHandler extends Handler {
  dungeon: Dungeon;

  // Coordinates for currently loaded room
  roomX: number;
  roomY: number;

  DungeonLoadEvent(event: Events.DungeonLoadEvent) {
    this.dungeon = event.dungeon;

    let start = this.dungeon.getStartPosition();
    let room = this.dungeon.getRoom(start.x, start.y);
    let player = this.game.findEntityByTag("player");

    // Move the player to the spawn location
    let position = player.get(Components.Position);
    let [x, y] = room.template.spawn;
    position.x = x;
    position.y = y;

    this.game.post(
      new Events.DungeonRoomEnterEvent(start.x, start.y)
    );
  }

  DungeonExitEvent(event: Events.DungeonExitEvent) {
    // Move to some other screen to show achievements etc?
  }

  DungeonRoomExitEvent(event: Events.DungeonRoomExitEvent) {
    let player = this.game.findEntityByTag("player");
    let room = this.dungeon.getRoom(this.roomX, this.roomY);

    // Remove the player (but keep a reference to their entity)
    this.game.removeEntity(player);

    // Move all the other entities from the game into the room
    room.entities = this.game.removeAllEntities();

    // Put the player back into the game
    this.game.addEntity(player);

    if (room.template.onExit) {
      room.template.onExit(this.game);
    }
  }

  DungeonRoomEnterEvent(event: Events.DungeonRoomEnterEvent) {
    // Update the current room
    this.roomX = event.roomX;
    this.roomY = event.roomY;

    let room = this.dungeon.getRoom(this.roomX, this.roomY);

    // Load the room's tile map into the game.
    this.game.tiles = room.tiles;

    // If this is the first time we've entered the room, run it's setup
    // function.
    if (room.loaded === false) {
      if (room.template.setup) {
        room.template.setup(this.game);
      }

      if (room.template.preset === false) {
        // TODO: Spawn appropriate entities in here based on what's
        // already happened in this game.
      }

      room.loaded = true;
    }

    // Load any entities that were already stored in this room.
    for (let entity of room.entities) {
      this.game.addEntity(entity);
    }

    if (room.template.onEnter) {
      room.template.onEnter(this.game);
    }
  }

  BoundsBlockEvent(event: Events.BoundsBlockEvent) {
    let { entity, x, y } = event;

    // Regular entities can't move between rooms
    if (!entity.hasTag("player")) return;

    let oldRoomX = this.roomX;
    let oldRoomY = this.roomY;
    let newRoomX = this.roomX;
    let newRoomY = this.roomY;

    if (x < 0) newRoomX -= 1;
    else if (y < 0) newRoomY -= 1;
    else if (x >= this.game.tiles.width) newRoomX += 1;
    else if (y >= this.game.tiles.height) newRoomY += 1;

    let newRoom = this.dungeon.getRoom(newRoomX, newRoomY);
    let oldRoom = this.dungeon.getRoom(oldRoomX, oldRoomY);

    if (newRoom == null) {
      return this.game.post(new Events.MessageEvent("You can't get through there"));
    }

    this.game.post(new Events.DungeonRoomExitEvent());
    this.game.post(new Events.DungeonRoomEnterEvent(newRoomX, newRoomY));

    // Move player to corresponding entrance in the new room
    let position = entity.get(Components.Position);
    if (x < 0) position.x = newRoom.tiles.width - 1;
    else if (y < 0) position.y = newRoom.tiles.height - 1;
    else if (x >= oldRoom.tiles.width) position.x = 0;
    else if (y >= oldRoom.tiles.height) position.y = 0;
  }
}

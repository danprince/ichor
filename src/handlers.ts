import { Event, Entity, Handler, Game } from "./engine";
import { Sprites } from "./sprites";
import * as Events from "./events";
import * as Components from "./components";

export class ScriptingHandler extends Handler {
  Event(event: Event) {
    let entities = this.game.findEntities(Components.Scripts);

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

export class ControlsHandler extends Handler {
  constructor(private bindings: any, private element: HTMLElement) {
    super();

    window.addEventListener("keydown", event => {
      this.game.post(new Events.KeyDownEvent(event.key));
    });

    this.element.addEventListener("click", event => {
      let rect = this.element.getBoundingClientRect();

      this.game.post(new Events.ClickEvent(
        event.clientX - rect.left,
        event.clientY - rect.top,
      ));
    });
  }

  KeyDownEvent(event: Events.KeyDownEvent) {
    for (let name in this.bindings) {
      let keys = this.bindings[name];

      if (keys.includes(event.name)) {
        let event = new Events[name];
        this.game.post(event);
      }
    }
  }
}

export class MovementHandler extends Handler {
  EntityMoveEvent(event: Events.EntityMoveEvent) {
    let { entity, x, y } = event;
    let origin = entity.get(Components.Position);

    // Entity is already at the target
    if (origin.is(x, y)) {
      return;
    }

    let enterTile = this.game.getTile(x, y);
    let exitTile = this.game.getTile(origin.x, origin.y);

    // We're blocked by the destination tile type
    if (enterTile.type.walkable === false) {
      return this.game.post(new Events.TileBlockEvent(entity, enterTile, x, y));
    }

    let entitiesOnTile = this.game
      .findEntities(Components.Position)
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

export class LightingHandler extends Handler {
  StartEvent(event: Events.StartEvent) {
    this.update();
  }

  TurnEvent(event: Events.TurnEvent) {
    this.update();
  }

  update() {
    let entities = this.game.findEntities(
      Components.LightSource,
      Components.Position
    );

    for (let [x, y, tile] of this.game.tiles) {
      tile.light = 0;

      for (let entity of entities) {
        let pos = entity.get(Components.Position);
        let light = entity.get(Components.LightSource);
        let value = 1 - (pos.distance(x, y) / light.radius);
        value = Math.min(value, 1);
        value = Math.max(value, 0);
        tile.light += value;

        if (value > 0) {
          tile.seen = true;
        }
      }
    }
  }
}

export class CombatHandler extends Handler {
  EntityTouchEvent(event: Events.EntityTouchEvent) {
    let { entity, target } = event;
    // If target is hostile, send AttackEvent
  }
}

export class MessagingHandler extends Handler {
  EntityTouchEvent(event: Events.EntityTouchEvent) {
    let { entity, target } = event;
    // If target has a message, add it to the queue
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

      this.game.removeEntity(entity);
      this.game.addEntity(corpse);
    }
  }
}

export class TurnHandler extends Handler {
  turns = 0;

  Event(event: Event) {
    switch (event.constructor) {
      case Events.MoveNorthEvent:
      case Events.MoveSouthEvent:
      case Events.MoveWestEvent:
      case Events.MoveEastEvent:
      case Events.MoveNorthWestEvent:
      case Events.MoveNorthEastEvent:
      case Events.MoveSouthWestEvent:
      case Events.MoveSouthEastEvent:
      case Events.SlotDropEvent:
      case Events.SlotUseEvent:
        this.turns += 1;
        this.game.post(new Events.TurnEvent);
    }
  }
}

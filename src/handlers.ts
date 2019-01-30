import { PermissiveFov } from "permissive-fov";
import { Event, Entity, Handler, Game } from "./engine";
import { Sprites } from "./sprites";
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

export class ControlsHandler extends Handler {
  constructor(private bindings: any, private element: HTMLElement) {
    super();

    window.addEventListener("keydown", event => {
      this.game.post(new Events.KeyDownEvent(event.key));
    });

    this.element.addEventListener("click", event => {
      let rect = this.element.getBoundingClientRect();

      this.game.post(new Events.CanvasClickEvent(
        event.clientX - rect.left,
        event.clientY - rect.top,
      ));
    });

    this.element.addEventListener("mousemove", event => {
      let rect = this.element.getBoundingClientRect();

      this.game.post(new Events.CanvasHoverEvent(
        event.clientX - rect.left,
        event.clientY - rect.top,
      ));
    });
  }

  KeyDownEvent(event: Events.KeyDownEvent) {
    for (let name in this.bindings) {
      let keys = this.bindings[name];

      if (keys.includes(event.name)) {
        let Event = Events[name];
        this.game.post(new Event());
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
  constructor(private element: HTMLElement) {
    super();
  }

  MessageEvent(event: Events.MessageEvent) {
    let node = document.createElement("div");
    node.classList.add("message");
    node.setAttribute("data-channel", event.channel);
    node.innerHTML = event.text;
    this.element.appendChild(node);
    this.element.scrollTo(0, 0);
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

import { Event, Entity } from "./engine";
import { Tile } from "./tiles";
import { Channel } from "./messages";
import { Dungeon } from "./dungeon";

export class StartEvent extends Event {}
export class TurnEvent extends Event {}

export class MoveNorthEvent extends Event {}
export class MoveSouthEvent extends Event {}
export class MoveEastEvent extends Event {}
export class MoveWestEvent extends Event {}
export class MoveNorthWestEvent extends Event {}
export class MoveNorthEastEvent extends Event {}
export class MoveSouthWestEvent extends Event {}
export class MoveSouthEastEvent extends Event {}

export class SlotSelect1Event extends Event {}
export class SlotSelect2Event extends Event {}
export class SlotSelect3Event extends Event {}
export class SlotSelectNextEvent extends Event {}
export class SlotUseEvent extends Event {}
export class SlotDropEvent extends Event {}

export class CursorEnterEvent extends Event {
  constructor(
    public x: number,
    public y: number,
  ) {
    super();
  }
}

export class CursorExitEvent extends Event {
  constructor(
    public x: number,
    public y: number,
  ) {
    super();
  }
}

export class BoundsBlockEvent extends Event {
  constructor(
    public entity: Entity,
    public x: number,
    public y: number,
  ) {
    super();
  }
}

export class TileBlockEvent extends Event {
  constructor(
    public entity: Entity,
    public tile: Tile,
    public x: number,
    public y: number,
  ) {
    super();
  }
}

export class TileExitEvent extends Event {
  constructor(
    public entity: Entity,
    public tile: Tile,
    public x: number,
    public y: number,
  ) {
    super();
  }
}

export class TileEnterEvent extends Event {
  constructor(
    public entity: Entity,
    public tile: Tile,
    public x: number,
    public y: number,
  ) {
    super();
  }
}

export class EntityTouchEvent extends Event {
  constructor(
    public entity: Entity,
    public target: Entity,
  ) {
    super();
  }
}

export class EntityTouchedEvent extends Event {
  constructor(
    public entity: Entity,
    public target: Entity,
  ) {
    super();
  }
}

export class EntityBlockEvent extends Event {
  constructor(
    public entity: Entity,
    public target: Entity,
  ) {
    super();
  }
}

export class EntityDisplaceEvent extends Event {
  constructor(
    public entity: Entity,
    public target: Entity,
  ) {
    super();
  }
}

export class EntityDestroyEvent extends Event {
  constructor(public entity: Entity) {
    super();
  }
}

export class EntityMoveEvent extends Event {
  constructor(
    public entity: Entity,
    public x: number,
    public y: number,
  ) {
    super();
  }
}

export class EntityMoveByEvent extends Event {
  constructor(
    public entity: Entity,
    public x: number,
    public y: number,
  ) {
    super();
  }
}

export class MessageEvent extends Event {
  constructor(
    public text: string,
    public channel: Channel = "info"
  ) {
    super();
  }
}

export class PlayerAttackEvent extends Event {
  constructor(
    public target: Entity
  ) {
    super();
  }
}

export class DealDamageEvent extends Event {
  constructor(
    public entity: Entity,
    public dealer: Entity,
    public amount: number
  ) {
    super();
  }
}

export class DealtDamageEvent extends Event {
  constructor(
    public entity: Entity,
    public dealer: Entity,
    public amount: number
  ) {
    super();
  }
}

export class TipShowEvent extends Event {
  constructor(
    public x: number,
    public y: number,
    public message: string
  ) {
    super();
  }
}

export class TipHideEvent extends Event {
  constructor() {
    super();
  }
}

export class DungeonLoadEvent extends Event {
  constructor(
    public dungeon: Dungeon,
  ) {
    super();
  }
}

export class DungeonEnterEvent extends Event {
  constructor(
    public roomX: number,
    public roomY: number,
  ) {
    super();
  }
}

export class DungeonExitEvent extends Event {
  constructor(public dungeon: Dungeon) {
    super();
  }
}

export class DungeonRoomExitEvent extends Event {
  constructor() {
    super();
  }
}

export class DungeonRoomEnterEvent extends Event {
  constructor(public roomX: number, public roomY: number) {
    super();
  }
}

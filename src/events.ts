import { Event, Entity } from "./engine";
import { Tile } from "./tiles";

export class StartEvent extends Event {}
export class TurnEvent extends Event {}
export class PauseEvent extends Event {}

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

export class KeyDownEvent extends Event {
  constructor(public name: string) {
    super();
  }
}

export class ClickEvent extends Event {
  constructor(public x: number, public y: number) {
    super();
  }
}

export class HoverEvent extends Event {
  constructor(public x: number, public y: number) {
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

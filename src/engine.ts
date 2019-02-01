import { ConstructorType, Grid, PriorityQueue, uid } from "./utils";
import { Tile, TileMap } from "./tiles";
import config from "./config";
import * as Events from "./events";

export class Game {
  private handlers = new PriorityQueue<Handler>(Handler.sort);
  private entities: Entity[] = [];
  tiles: Grid<Tile>;

  // Events + Handlers

  addHandler(handler: Handler) {
    this.handlers.add(handler);
    handler.attachToGame(this);
  }

  removeHandler(handler: Handler) {
    this.handlers.remove(handler);
    handler.detachFromGame();
  }

  post(event: Event) {
    let key = event.constructor.name;
    let tracing = config["debug.traceEvents"];

    if (tracing) {
      console.groupCollapsed("Event", event.constructor.name);
      console.log(event);
    }

    for (let handler of this.handlers) {
      // Look for generic event handler method
      if (handler["Event"]) {
        handler["Event"](event);
      }

      // Look for specific method for handling this event
      if (key in handler) {
        if (tracing) {
          console.group("Handler", handler.constructor.name);
        }

        handler[key](event);

        if (tracing) {
          console.groupEnd();
        }
      }
    }

    if (tracing) {
      console.groupEnd();
    }
  }


  // Entities

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  removeEntity(entity: Entity) {
    this.entities = this.entities.filter(other => other !== entity);
  }

  removeAllEntities(): Entity[] {
    let entities = this.entities;
    this.entities = [];
    return entities;
  }

  findEntityById(id: number): Entity {
    return this.entities.find(entity => entity.id === id);
  }

  findEntityByTag(tag: string): Entity {
    return this.entities.find(entity => entity.tags.has(tag));
  }

  findEntity(fn: (entity: Entity) => boolean): Entity | undefined {
    return this.entities.find(fn);
  }

  findEntities(fn: (entity: Entity) => boolean): Entity[] {
    return this.entities.filter(fn);
  }

  findEntitiesWith(...componentClasses: ConstructorType<Component>[]): Entity[] {
    let entities = [...this.entities.values()];
    return entities.filter(entity => entity.has(...componentClasses));
  }

  getAllEntities() {
    return this.entities;
  }


  // Tiles

  getTile(x: number, y: number) {
    return this.tiles.get(x, y);
  }
}

export class Event {
  // Optionally address an event to an entity, this is used to make sure
  // that scripts only receive messages for the entities they are attached
  // to.
  entity?: Entity;
}

export class Handler {
  protected game: Game;
  protected priority = 0;

  static sort(a: Handler, b: Handler) {
    return b.priority - a.priority;
  }

  attachToGame(game: Game) {
    this.game = game;
  }

  detachFromGame() {
    this.game = null;
  }
}

export class Entity {
  public id = uid();
  public tags = new Set<string>();

  private components: {
    [key: string]: Component
  } = {};

  static with(...components: Component[]) {
    let entity = new Entity();
    entity.add(...components);
    return entity;
  }

  get<T>(componentClass: ConstructorType<T>): T {
    return this.components[componentClass.name] as unknown as T;
  }

  add(...components: Component[]) {
    for (let component of components) {
      this.components[component.constructor.name] = component;
    }
  }

  remove(...componentClasses: ConstructorType<Component>[]) {
    for (let componentClass of componentClasses) {
      delete this.components[componentClass.name];
    }
  }

  has(...componentClasses: ConstructorType<any>[]): boolean {
    return componentClasses.every(componentClass => {
      return componentClass.name in this.components;
    });
  }

  map<T>(componentClass: ConstructorType<T>, fn: (component: T) => any): this {
    if (this.has(componentClass)) {
      fn(this.get(componentClass));
    }

    return this;
  }

  addTag(tag: string) {
    this.tags.add(tag);
  }

  hasTag(tag: string): boolean {
    return this.tags.has(tag);
  }

  removeTag(tag: string) {
    this.tags.delete(tag);
  }
}

export class Component {

}

export type Script = {
  [Name in keyof typeof Events]?: (
    self: Entity,
    event: InstanceType<typeof Events[Name]>,
    game: Game
  ) => void;
};

import { uid, PriorityQueue } from "./utils";
import { TileMap } from "./tiles";
import * as config from "../config.json";
import * as Events from "./events";

type Constructor<T> = {
  new(...args: any[]): T;
  name?: string;
}

type Registry<T> = {
  [id: string]: Constructor<T>
};

type Module = {
  handlers: Registry<Handler>,
  events: Registry<Event>,
  components: Registry<Component>,
};

export class Game {
  registry: {
    handlers: Registry<Handler>,
    events: Registry<Event>,
    components: Registry<Component>,
  } = {
    handlers: {},
    events: {},
    components: {},
  };

  handlers = new PriorityQueue<Handler>(
    (a, b) => a.priority - b.priority
  );

  entities = new Map<number, Entity>();

  tiles: TileMap;

  // Modules/plugins

  register(module: Module) {
    Object.assign(this.registry, module);
  }

  // Handlers

  addHandler(handler: Handler) {
    this.handlers.add(handler);
    handler.attachToGame(this);
  }

  removeHandler(handler: Handler) {
    this.handlers.remove(handler);
    handler.detachFromGame();
  }

  // Events

  post(event: Event) {
    let key = event.constructor.name;
    let tracing = config["debug.traceEvents"];

    if (tracing) {
      console.groupCollapsed("Event", event.constructor.name);
      console.log(event);
    }

    try {
      for (let handler of this.handlers) {
        if (key in handler) {
          if (tracing) console.group("Handler", handler.constructor.name);
          handler[key](event);
          if (tracing) console.groupEnd();
        }

        if (handler["Event"]) {
          handler["Event"](event);
        }
      }
    } catch (err) {
      if (tracing) {
        console.groupEnd();
        throw err;
      }
    }

    if (tracing) {
      console.groupEnd();
    }
  }

  // Entities

  findEntity(id: number): Entity {
    return this.entities.get(id);
  }

  findEntities(...componentClasses: Constructor<Component>[]): Entity[] {
    let entities = [...this.entities.values()];
    return entities.filter(entity => entity.has(...componentClasses));
  }

  addEntity(entity: Entity) {
    this.entities.set(entity.id, entity);
  }

  removeEntity(entity: Entity) {
    this.entities.delete(entity.id);
  }

  // Tiles

  getTile(x: number, y: number) {
    return this.tiles.at(x, y);
  }
}

export class Event {
  // Optionally address an event to an entity, this is used to make sure
  // that scripts only receive messages for the entities they are attached
  // to.
  entity?: Entity;
}

export class Handler {
  game: Game;
  priority = 0;

  attachToGame(game: Game) {
    this.game = game;
  }

  detachFromGame() {
    this.game = null;
  }
}

export class Entity {
  public id = uid();
  private components: { [key: string]: any } = {};

  static with(...components: Component[]) {
    let entity = new Entity();
    entity.add(...components);
    return entity;
  }

  static query(...componentClasses: Constructor<Component>[]) {
    return entity => entity.has(...componentClasses);
  }

  get<T>(componentClass: Constructor<T>): T {
    return this.components[componentClass.name] as unknown as T;
  }

  add(...components: Component[]) {
    for (let component of components) {
      this.components[component.constructor.name] = component;
    }
  }

  remove(...componentClasses: Constructor<Component>[]) {
    for (let componentClass of componentClasses) {
      delete this.components[componentClass.name];
    }
  }

  has(...componentClasses: Constructor<any>[]): boolean {
    return componentClasses.every(componentClass => {
      return componentClass.name in this.components;
    });
  }

  map<T>(componentClass: Constructor<T>, fn: (component: T) => any): this {
    if (this.has(componentClass)) {
      fn(this.get(componentClass));
    }

    return this;
  }
}

export class Component {

}

export type Script<Events = typeof Events> = {
  [Name in keyof Events]?: (
    self: Entity,
    // https://stackoverflow.com/questions/54426594/get-instance-type-from-constructor-type
    event: Event,
    game: Game
  ) => void;
}

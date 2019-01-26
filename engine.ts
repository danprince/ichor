import { uid } from "./utils";

type Constructor<T> = {
  new(): T;
}

export class Game {
  handlers: Handler[] = [];
  entities: Entity[] = [];
  terrain: number[] = [];
  dispatching = false;

  addHandler(handler: Handler) {
    this.handlers.push(handler);
    handler.attachToGame(this);
  }

  removeHandler(handler: Handler) {
    this.handlers = this.handlers.filter(other => other !== handler);
    handler.detachFromGame();
  }

  broadcast(event: Event) {
    this.dispatching = true;

    for (let handler of this.handlers) {
      handler.onEvent(event);
    }

    this.dispatching = false;
  }

  findEntity(id: number): Entity {
    return this.entities.find(entity => entity.id === id);
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  removeEntity(entity: Entity) {
    this.entities = this.entities.filter(other => other !== entity);
  }
}

export class Event {

}

export class Handler {
  game: Game;

  attachToGame(game: Game) {
    this.game = game;
  }

  detachFromGame() {
    this.game = null;
  }

  onEvent(event: Event) {
    let key = event.constructor.name;

    if (key in this) {
      this[key](event);
    }
  }
}

export class Entity {
  public id = uid();
  private components: { [key: string]: any } = {};

  get<T>(componentClass: Constructor<T>): T {
    return this.components[componentClass.name] as unknown as T;
  }

  add(component: any) {
    this.components[component.constructor.name] = component;
  }

  remove(componentClass: Constructor<any>) {
    delete this.components[componentClass.name];
  }

  has<T>(componentClass: Constructor<T>): boolean {
    return componentClass.name in this.components;
  }

  map<T>(componentClass: Constructor<T>, fn: (component: T) => T): this {
    if (this.has(componentClass)) {
      fn(this.get(componentClass));
    }

    return this;
  }
}

export class Component {

}

// TODO: Useful but how to avoid duplication?
export type EventMap<Events> = {
  [K in keyof Events]?: (event: Events[K]) => void;
};

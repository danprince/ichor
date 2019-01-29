import { Game, Component, Entity, Event, Script } from "./engine";
import { Sprites } from "./sprites";

export class Position extends Component {
  constructor(public x: number, public y: number) {
    super();
  }

  is(x: number, y: number) {
    return this.x === x && this.y === y;
  }

  distance(x: number, y: number) {
    return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
  }
}

export class Sprite extends Component {
  constructor(public id: Sprites) {
    super();
  }
}

export class Animation extends Component {
  frame = 0;

  constructor(public sprite: Sprites, public frames = 1) {
    super();
  }

  step() {
    this.frame = (this.frame + 1) % this.frames;
  }

  currentSprite(): Sprites {
    return (this.sprite as unknown as number) + this.frame;
  }
}

export class Brain extends Component {}
export class Control extends Component {}
export class Blocking extends Component {}

export class Scripts extends Component {
  scripts: Script[] = [];

  constructor(...scripts: Script[]) {
    super();

    for (let script of scripts) {
      this.add(script);
    }
  }

  add(script: Script) {
    this.scripts.push(script);
  }

  remove(script: Script) {
    this.scripts = this.scripts.filter(other => other !== script);
  }
}

export class Blood extends Component {
  constructor(public capacity: number, public current = capacity) {
    super();
  }

  change(delta: number) {
    this.current += delta;
    this.current = Math.min(this.current, this.capacity);
    this.current = Math.max(this.current, 0);
  }

  reset() {
    this.current = this.capacity;
  }
}

export class Breakable extends Component {
  constructor(public sprite: Sprites) {
    super();
  }
}

export class FX extends Component {
  opacity = 1;
  translate = { x: 0, y: 0 };
  scale = 1;
  rotate = 0;
  length = 0;

  constructor(public name: "float-out" | "explode", public frames = 10) {
    super();
    this.length = frames;
    this.start();
  }

  get progress() {
    return 1 - (this.frames / this.length);
  }

  start() {
    switch (this.name) {
      case "float-out":
        this.translate.y -= 20;
        break;
    }
  }

  step() {
    this.frames -= 1;

    switch (this.name) {
      case "float-out":
        this.translate.y -= 0.8;
        break;
      case "explode":
        this.scale += 0.1;
        this.opacity -= 0.02;
        break;
    }
  }

  hasFinished() {
    return this.frames <= 0;
  }
}

export class Layer extends Component {
  constructor(public index: number) {
    super();
  }
}

export class LightSource extends Component {
  constructor(public radius: number) {
    super();
  }
}

export class Name extends Component {
  constructor(public value: string) {
    super();
  }
}

export class Description extends Component {
  constructor(public value: string) {
    super();
  }
}

export class Openable extends Component {
  constructor(public sprite: Sprites) {
    super();
  }
}

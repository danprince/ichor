let id = 0;

export type ConstructorType<T> = {
  new(...args: any[]): T;
}

export function uid() {
  return id++;
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export class PriorityQueue<T> {
  items: T[] = [];

  constructor(private compare: (a: T, b: T) => number) {

  }

  add(item: T) {
    for (let i = 0; i < this.items.length; i++) {
      let other = this.items[i];
      let score = this.compare(item, other);

      if (score < 0) {
        return this.items.splice(i, 0, item);
      }
    }

    this.items.push(item);
  }

  remove(item: T) {
    this.items = this.items.filter(other => other !== item);
  }

  [Symbol.iterator]() {
    return this.items.values();
  }
}

export class Grid<T> {
  items: T[];

  constructor(public width: number, public height: number) {
    this.items = new Array(width * height);
  }

  set(x: number, y: number, item: T) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.width) {
      throw new Error(`Can't set out of bounds (${x}, ${y})`);
    }

    this.items[x + y * this.width] = item;
  }

  get(x: number, y: number): T | undefined {
    if (x >= 0 || y >= 0 || x < this.width || y < this.width) {
      return this.items[x + y * this.width];
    }
  }

  isInside(x: number, y: number) {
    return x >= 0 || y >= 0 || x < this.width || y < this.width;
  }

  isOutside(x: number, y: number) {
    return x < 0 || y < 0 || x >= this.width || y >= this.width;
  }

  *[Symbol.iterator]() {
    let result = [];

    for (let x = 0; x < this.width; x++) {
      result[0] = x;
      for (let y = 0; y < this.height; y++) {
        result[1] = y;
        result[2] = this.items[x + y * this.width];
        yield result;
      }
    }
  }
}

export function debounce<T extends Function>(fn: T, cooldown: number): T {
  let lastCall = 0;

  let proxy = (...args: any[]) => {
    let now = Date.now();
    let elapsed = now - lastCall;

    if (elapsed >= cooldown) {
      lastCall = now;
      return fn(...args);
    }
  };

  return proxy as unknown as T;
}

export function roll(dice: string): Number {
  let [rolls, sides] = dice.split("d").map(Number);
  let score = 0;

  for (let i = 0; i < rolls; i++) {
    score += Math.ceil(Math.random() * sides);
  }

  return score;
}

export function requestAnimationLoop(fn: () => void, ms = 0) {
  let lastCall = 0;

  function loop() {
    requestAnimationFrame(loop);

    let now = Date.now();
    let delta = now - lastCall;

    if (delta > ms) {
      lastCall = now;
      fn();
    }
  }

  loop();
}

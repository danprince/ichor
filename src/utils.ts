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
    this.items.push(item);
    this.items.sort(this.compare);
  }

  remove(item: T) {
    this.items = this.items.filter(other => other !== item);
  }

  [Symbol.iterator]() {
    return this.items.values();
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
